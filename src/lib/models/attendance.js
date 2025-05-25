// src/lib/models/attendance.js
import mongoose from 'mongoose';
import User from './user.js';

const attendanceSchema = new mongoose.Schema({
    // Employee Reference
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Date Information
    date: {
        type: Date,
        required: true
    },

    // Time Information date and time
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },

    // Calculated Fields
    totalHours: {
        type: Number, // Store in minutes for easier calculation
        default: 0
    },

    // Status Information
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'Early Leave'],
        required: true,
        default: 'Present'
    },

    // Location Information
    location: {
        type: {
            type: String,
            enum: ['Office', 'Remote', 'Field'],
            default: 'Office'
        },
        name: {
            type: String,
            required: true
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            lngnlat: {
                type: [Number, Number],
                required: true
            }
        }
    },

    // Photo/Image for punch in/out
    punchInImage: {
        type: String // URL or file path
    },
    punchOutImage: {
        type: String // URL or file path
    },

    // Approval/Modification tracking
    isModified: {
        type: Boolean,
        default: false
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    modificationReason: {
        type: String,
        maxlength: 200
    },

    // Metadata
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Virtual for formatted total hours (e.g., "8h 30m")
attendanceSchema.virtual('totalHoursFormatted').get(function () {
    if (!this.totalHours) return '0h 0m';

    const hours = Math.floor(this.totalHours / 60);
    const minutes = this.totalHours % 60;
    return `${hours}h ${minutes}m`;
});

// Virtual for formatted check-in time
attendanceSchema.virtual('checkInFormatted').get(function () {
    if (!this.checkIn) return '-';
    return this.checkIn.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});

// Virtual for formatted check-out time
attendanceSchema.virtual('checkOutFormatted').get(function () {
    if (!this.checkOut) return '-';
    return this.checkOut.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
});

// Virtual for formatted date
attendanceSchema.virtual('dateFormatted').get(function () {
    return this.date.toISOString().split('T')[0]; // YYYY-MM-DD format
});

// Indexes for better query performance
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // One record per employee per day
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ status: 1 });
attendanceSchema.index({ location: 1 });
attendanceSchema.index({ employeeId: 1, date: -1 }); // For recent attendance queries

// Pre-save middleware to calculate total hours
attendanceSchema.pre('save', function (next) {
    // Calculate total hours if both check-in and check-out are present
    if (this.checkIn && this.checkOut) {
        const diffMs = this.checkOut - this.checkIn;
        this.totalHours = Math.round(diffMs / (1000 * 60)); // Convert to minutes
    } else {
        this.totalHours = 0;
    }

    // Auto-determine status based on check-in time (if not manually set)
    if (this.checkIn && !this.isModified) {
        const checkInHour = this.checkIn.getHours();
        const checkInMinute = this.checkIn.getMinutes();
        const checkInTime = checkInHour * 60 + checkInMinute; // Convert to minutes
        const nineAM = 9 * 60; // 9:00 AM in minutes

        if (checkInTime > nineAM) {
            this.status = 'Late';
        }
    }

    next();
});

// Static method to get attendance for a specific date range
attendanceSchema.statics.getAttendanceByDateRange = function (startDate, endDate, employeeId = null) {
    const query = {
        date: {
            $gte: startDate,
            $lte: endDate
        }
    };

    if (employeeId) {
        query.employeeId = employeeId;
    }

    return this.find(query).populate('employeeId', 'firstName lastName employeeId');
};

// Static method to get today's attendance summary
attendanceSchema.statics.getTodaysSummary = function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.aggregate([
        {
            $match: {
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);
};

// Instance method to mark as late arrival
attendanceSchema.methods.markAsLate = function () {
    this.status = 'Late';
    this.isModified = true;
    return this.save();
};

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;