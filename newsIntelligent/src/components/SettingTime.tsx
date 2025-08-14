// SettingTime.tsx
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SettingTimeModal from './SettingTimeModal';
import { getSetting, postSetDailyReport, deleteSettingTime } from '../apis/members';

type TimeItem = { id: number; time: string; topicId?: number };

const pad = (n: number) => n.toString().padStart(2, '0');

const toTimeString = (v: any) => {
  if (!v) return null;
  if (typeof v === 'string') {
    const s = v.slice(0, 5);
    return /^\d{2}:\d{2}$/.test(s) ? s : null;
  }
  if (typeof v === 'object') {
    if (typeof v.time === 'string') {
      const s = v.time.slice(0, 5);
      return /^\d{2}:\d{2}$/.test(s) ? s : null;
    }
    if (Number.isInteger(v.hour) && Number.isInteger(v.minute)) {
      return `${pad(v.hour)}:${pad(v.minute)}`;
    }
  }
  return null;
};

const normalize = (res: any): TimeItem[] => {
  const r = res?.result ?? res;
  const items = Array.isArray(r?.dailyReportTimes) ? r.dailyReportTimes : [];
  const out: TimeItem[] = [];
  for (const it of items) {
    const time = toTimeString(it);
    if (!time) continue;
    const id =
      typeof it?.id === 'number'
        ? it.id
        : typeof it?.timeId === 'number'
        ? it.timeId
        : -1;
    const topicId = typeof it?.topicId === 'number' ? it.topicId : undefined;
    out.push({ id, time, topicId });
  }
  return out.length ? out.slice(0, 3) : [{ id: -1, time: '11:00' }];
};

const formatToMeridiem = (time: string) => {
  const [h, m] = time.split(':');
  let hour = parseInt(h, 10);
  const meridiem = hour < 12 ? '오전' : '오후';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${meridiem} ${hour.toString().padStart(2, '0')}:${m}`;
};

export default function SettingTime() {
  const [times, setTimes] = useState<TimeItem[]>([]);
  const [isClick, setIsClick] = useState(false);
  const seq = useRef(0);

  const refresh = async () => {
    const cur = ++seq.current;
    try {
      const res = await getSetting();
      const data = normalize(res);
      if (cur === seq.current) setTimes(data);
    } catch {
      if (cur === seq.current) setTimes((p) => (p.length ? p : [{ id: -1, time: '11:00' }]));
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAddTime = async (newTime: string) => {
    if (times.some((t) => t.time === newTime) || times.length >= 3) {
      setIsClick(false);
      return;
    }
    const optimistic: TimeItem = { id: -1, time: newTime };
    setTimes((p) => [...p, optimistic]);
    try {
      const res = await postSetDailyReport(newTime);
      const topicId =
        typeof res?.result === 'number'
          ? res.result
          : typeof res?.result === 'number'
          ? res.result
          : undefined;
      await refresh();
      if (topicId) {
        setTimes((p) =>
          p.map((t) => (t.id === -1 && t.time === newTime ? { ...t, topicId } : t))
        );
      }
    } catch {
      setTimes((p) => p.filter((t) => !(t.id === -1 && t.time === newTime)));
    } finally {
      setIsClick(false);
    }
  };

  const handleRemoveTime = async (index: number) => {
    const target = times[index];
    if (!target) return;
    const prev = times;
    setTimes((p) => p.filter((_, i) => i !== index));
    try {
      if (typeof target.topicId === 'number') {
        await deleteSettingTime(target.topicId);
      }
      if (typeof target.id === 'number' && target.id > 0) {
        await deleteSettingTime(target.id);
      }
      await refresh();
    } catch {
      setTimes(prev);
    }
  };

  return (
    <div className={`flex items-center justify-center relative ${times.length ? 'gap-2' : ''}`}>
      <div className="flex flex-wrap relative gap-2">
        {times.map((item, idx) => (
          <button
            key={`${item.id}-${item.time}-${idx}`}
            className="flex items-center justify-center pr-[4px] pl-[10px] font-medium text-[13px] border border-[#0EA6C0] text-[#0EA6C0] w-[104.28px] h-[28.28px] rounded-full"
          >
            <span>{formatToMeridiem(item.time)}</span>
            <button
              onClick={() => handleRemoveTime(idx)}
              aria-label="remove time"
              className="disabled:opacity-50"
            >
              <Plus size={11} strokeWidth={2} className="w-[20px] h-[20px] rotate-45" />
            </button>
          </button>
        ))}
      </div>

      {times.length < 3 && (
        <div className="relative">
          <button
            onClick={() => setIsClick(true)}
            className={`flex items-center justify-center pr-[10px] pl-[6px] font-medium text-[13px] border border-[1px] border-[#0EA6C0] text-[#0EA6C0] w-[113px] h-[28px] rounded-full focus:outline-none transition-colors duration-200 ease-in-out ${
              isClick ? 'bg-[#0EA6C026]' : times.length ? 'text-[#919191] border-[#919191]' : 'bg-white'
            }`}
          >
            <Plus size={11} strokeWidth={2} className="w-[20px] h-[20px]" />
            <div className="w-[77px]">시간 추가하기</div>
          </button>
        </div>
      )}

      {isClick && (
        <div className="absolute left-full ml-2 top-0 z-10">
          <SettingTimeModal onAdd={handleAddTime} onCancel={() => setIsClick(false)} />
        </div>
      )}
    </div>
  );
}
