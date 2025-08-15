import { Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SettingTimeModal from './SettingTimeModal';
import { getSetting, postSetDailyReport, deleteSettingTime } from '../apis/members';

type TimeItem = { time: string };

const DEFAULT_TIME = '11:00';
const IDS_STORAGE_KEY = 'dailyReportTimeIds';
const DEFAULT_REMOVED_KEY = 'dailyReportDefaultRemoved';

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

const normalizeTimes = (res: any): string[] => {
  const r = res?.result ?? res;
  const items = Array.isArray(r?.dailyReportTimes) ? r.dailyReportTimes : [];
  const out: string[] = [];
  for (const it of items) {
    const time = toTimeString(it);
    if (time) out.push(time);
  }
  return Array.from(new Set(out)).slice(0, 3);
};

const formatToMeridiem = (time: string) => {
  const [h, m] = time.split(':');
  let hour = parseInt(h, 10);
  const meridiem = hour < 12 ? '오전' : '오후';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${meridiem} ${hour.toString().padStart(2, '0')}:${m}`;
};

const loadIds = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(IDS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const saveIds = (m: Record<string, number>) => {
  try {
    localStorage.setItem(IDS_STORAGE_KEY, JSON.stringify(m));
  } catch {}
};

const loadDefaultRemoved = (): boolean => {
  try {
    return localStorage.getItem(DEFAULT_REMOVED_KEY) === '1';
  } catch {
    return false;
  }
};

const saveDefaultRemoved = (v: boolean) => {
  try {
    localStorage.setItem(DEFAULT_REMOVED_KEY, v ? '1' : '0');
  } catch {}
};

export default function SettingTime() {
  const [times, setTimes] = useState<TimeItem[]>([]);
  const [isClick, setIsClick] = useState(false);
  const [idsByTime, setIdsByTime] = useState<Record<string, number>>({});
  const [defaultRemoved, setDefaultRemoved] = useState(false);
  const seq = useRef(0);

  useEffect(() => {
    saveIds(idsByTime);
  }, [idsByTime]);

  useEffect(() => {
    saveDefaultRemoved(defaultRemoved);
  }, [defaultRemoved]);

  useEffect(() => {
    setIdsByTime(loadIds());
    setDefaultRemoved(loadDefaultRemoved());
    refresh();
  }, []);

  const composeTimes = (serverTimes: string[]) => {
    const includesDefaultOnServer = serverTimes.includes(DEFAULT_TIME);
    const shouldShowLocalDefault = !defaultRemoved && !includesDefaultOnServer;
    const merged = (shouldShowLocalDefault ? [DEFAULT_TIME] : []).concat(serverTimes);
    return merged.slice(0, 3).map((t) => ({ time: t }));
  };

  const refresh = async () => {
    const cur = ++seq.current;
    try {
      const res = await getSetting();
      if (cur !== seq.current) return;
      const serverTimes = normalizeTimes(res);
      if (serverTimes.length === 0) {
        const initial = defaultRemoved ? [] : [DEFAULT_TIME];
        setTimes(initial.map((t) => ({ time: t })));
      } else {
        setTimes(composeTimes(serverTimes));
      }
      setIdsByTime((m) => {
        const next: Record<string, number> = {};
        for (const t of serverTimes) if (typeof m[t] === 'number') next[t] = m[t];
        if (!defaultRemoved && typeof m[DEFAULT_TIME] === 'number') next[DEFAULT_TIME] = m[DEFAULT_TIME];
        return next;
      });
    } catch {
      if (cur !== seq.current) return;
      setTimes(defaultRemoved ? [] : [{ time: DEFAULT_TIME }]);
    }
  };

  const handleAddTime = async (newTime: string) => {
    const currentList = times.map((t) => t.time);
    if (currentList.includes(newTime) || currentList.length >= 3) {
      setIsClick(false);
      return;
    }
    setTimes((p) => [...p, { time: newTime }].slice(0, 3));
    try {
      const res = await postSetDailyReport(newTime);
      const createdId =
        typeof res?.result === 'number'
          ? res.result
          : typeof res?.result?.id === 'number'
          ? res.result.id
          : undefined;
      if (typeof createdId === 'number') {
        setIdsByTime((m) => ({ ...m, [newTime]: createdId }));
      }
      await refresh();
    } catch {
      setTimes((p) => p.filter((t) => t.time !== newTime));
    } finally {
      setIsClick(false);
    }
  };

  const handleRemoveByTime = async (time: string) => {
    const id = idsByTime[time];
    if (!id || id <= 0) {
      if (time === DEFAULT_TIME) {
        setDefaultRemoved(true);
      }
      setTimes((p) => p.filter((t) => t.time !== time));
      setIdsByTime((m) => {
        const { [time]: _, ...rest } = m;
        return rest;
      });
      return;
    }
    const prevTimes = times;
    const prevMap = idsByTime;
    setTimes((p) => p.filter((t) => t.time !== time));
    setIdsByTime((m) => {
      const { [time]: _, ...rest } = m;
      return rest;
    });
    try {
      await deleteSettingTime(id);
      await refresh();
    } catch {
      setTimes(prevTimes);
      setIdsByTime(prevMap);
    }
  };

  return (
    <div className={`flex items-center justify-center relative ${times.length ? 'gap-2' : ''}`}>
      <div className="flex flex-wrap relative gap-2">
        {times.map((item, idx) => (
          <div
            key={`${item.time}-${idx}`}
            className="flex items-center justify-center pr-[4px] pl-[10px] font-medium text-[13px] border border-[#0EA6C0] text-[#0EA6C0] w-[104.28px] h-[28.28px] rounded-full"
          >
            <span>{formatToMeridiem(item.time)}</span>
            <button
              onClick={() => handleRemoveByTime(item.time)}
              aria-label="remove time"
              className="disabled:opacity-50"
            >
              <Plus size={11} strokeWidth={2} className="w-[20px] h-[20px] rotate-45" />
            </button>
          </div>
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
