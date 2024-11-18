// src/widgets/Attendance/Attendance.tsx

import React, { useState } from 'react';
import AttendanceDay from '@/features/AttendanceDay/components/AttendanceDay';
import { useUserStore } from '@/entities/User/model/userModel';

type DayKeys = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

const getTodayDay = (): DayKeys => {
  const days: DayKeys[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  return days[today.getDay()];
};

const Attendance: React.FC = () => {
  const { weekAttendance } = useUserStore();
  const [today] = useState<DayKeys>(getTodayDay());

  const getStatus = (day: DayKeys) => {
    const attendanceData: { [key in DayKeys]: boolean | null } = {
      SUN: weekAttendance.sun,
      MON: weekAttendance.mon,
      TUE: weekAttendance.tue,
      WED: weekAttendance.wed,
      THU: weekAttendance.thu,
      FRI: weekAttendance.fri,
      SAT: weekAttendance.sat,

    };

    if (attendanceData[day]) return 'checked';
    if (day === today) return 'today';
    const daysOfWeek: DayKeys[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const todayIndex = daysOfWeek.indexOf(today);
    const dayIndex = daysOfWeek.indexOf(day);
    return dayIndex < todayIndex ? 'missed' : 'default';
  };

  const days: DayKeys[] = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div>
      <h1 className="flex items-center justify-center text-white font-jalnan text-3xl">Attendance</h1>
      <div
        id="attendance"
        className="grid grid-cols-7 gap-2 bg-box mt-4 w-[332px] px-8 md:w-[595.95px] min-h-24 md:h-32 text-white text-xs mb-8"
      >
        {days.map((day, index) => (
          <AttendanceDay key={index} day={day} status={getStatus(day)} />
        ))}
      </div>
    </div>
  );
};

export default Attendance;
