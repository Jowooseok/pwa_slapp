import React, { useEffect, useState } from 'react';
import AttendanceDay from '@/features/AttendanceDay/components/AttendanceDay';

// 임의의 출석 체크 데이터
const fetchAttendanceData = async () => {
  return {
    MON: true,
    TUE: false,
    WED: false,
    THU: false,
    FRI: false,
    SAT: false,
    SUN: false,
  };
};

const getTodayDay = () => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const today = new Date();
  return days[today.getDay()];
};

const Attendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<{
    [key: string]: boolean;
  }>({});
  const [today, setToday] = useState<string>(getTodayDay());

  useEffect(() => {
    const loadAttendanceData = async () => {
      const data = await fetchAttendanceData();
      setAttendanceData(data);
    };

    loadAttendanceData();
  }, []);

  const getStatus = (day: string) => {
    if (attendanceData[day]) return 'checked';
    if (day === today) return 'today';
    const todayIndex = [
      'SUN',
      'MON',
      'TUE',
      'WED',
      'THU',
      'FRI',
      'SAT',
    ].indexOf(today);
    const dayIndex = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].indexOf(
      day,
    );
    return dayIndex < todayIndex ? 'missed' : 'default';
  };

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div
      id="attendance"
      className="grid grid-cols-7 gap-2 bg-box mt-4 w-[332px] px-8 md:w-[595.95px] min-h-24 md:h-32 text-white text-xs mb-8"
    >
      {days.map((day, index) => (
        <AttendanceDay key={index} day={day} status={getStatus(day)} />
      ))}
    </div>
  );
};

export default Attendance;
