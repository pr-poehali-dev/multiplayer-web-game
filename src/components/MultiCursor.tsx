
import { useState, useEffect, useRef } from 'react';

interface MultiCursorProps {
  // Дополнительные классы для контейнера
  className?: string;
}

interface CursorData {
  id: string;
  x: number;
  y: number;
  color: string;
  deviceId: string;
  timestamp: number;
}

// Компонент для отображения нескольких курсоров при подключении нескольких мышей
const MultiCursor = ({ className }: MultiCursorProps) => {
  const [cursors, setCursors] = useState<CursorData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceIdRef = useRef<Map<number, string>>(new Map());
  const cursorColorsRef = useRef<Map<string, string>>(new Map());
  const pointerIdsRef = useRef<Set<number>>(new Set());
  
  // Функция для генерации случайного цвета
  const getRandomColor = () => {
    const colors = [
      '#FF5252', // Красный
      '#4CAF50', // Зеленый
      '#2196F3', // Синий
      '#FF9800', // Оранжевый
      '#9C27B0', // Фиолетовый
      '#00BCD4', // Голубой
      '#FFC107', // Желтый
      '#795548', // Коричневый
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Генерация уникального ID для каждого устройства
  const getDeviceId = (pointerId: number) => {
    if (!deviceIdRef.current.has(pointerId)) {
      const newId = `device-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      deviceIdRef.current.set(pointerId, newId);
      pointerIdsRef.current.add(pointerId);
      
      // Назначаем цвет для нового устройства
      if (!cursorColorsRef.current.has(newId)) {
        cursorColorsRef.current.set(newId, getRandomColor());
      }
    }
    return deviceIdRef.current.get(pointerId) as string;
  };

  // Получение цвета для устройства
  const getColorForDevice = (deviceId: string) => {
    if (!cursorColorsRef.current.has(deviceId)) {
      cursorColorsRef.current.set(deviceId, getRandomColor());
    }
    return cursorColorsRef.current.get(deviceId) as string;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    const handlePointerMove = (event: PointerEvent) => {
      // Проверяем, что это мышь или стилус (не сенсорное касание)
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        const deviceId = getDeviceId(event.pointerId);
        const color = getColorForDevice(deviceId);
        
        // Вычисляем координаты относительно контейнера
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Обновляем состояние курсоров
        setCursors(prev => {
          // Находим курсор для данного deviceId
          const cursorIndex = prev.findIndex(c => c.deviceId === deviceId);
          const now = Date.now();
          
          // Удаляем устаревшие курсоры
          const filtered = prev.filter(c => now - c.timestamp < 2000);
          
          // Если курсор существует, обновляем его
          if (cursorIndex !== -1) {
            return filtered.map(c => 
              c.deviceId === deviceId 
                ? { ...c, x, y, timestamp: now } 
                : c
            );
          }
          
          // Если курсора нет, добавляем новый
          return [...filtered, {
            id: `cursor-${deviceId}`,
            x,
            y,
            color,
            deviceId,
            timestamp: now
          }];
        });
      }
    };
    
    // Обработчик начала взаимодействия с указателем
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        // Убедимся, что у нас есть информация о новом устройстве
        getDeviceId(event.pointerId);
      }
    };
    
    // Обработчик потери фокуса для очистки курсоров при выходе из окна
    const handleBlur = () => {
      // Удаляем курсоры при потере фокуса
      setCursors([]);
    };
    
    // Обработчик для удаления курсора при отключении устройства
    const handlePointerLeave = (event: PointerEvent) => {
      const deviceId = deviceIdRef.current.get(event.pointerId);
      if (deviceId) {
        setCursors(prev => prev.filter(c => c.deviceId !== deviceId));
      }
    };
    
    // Обработчик для отключения устройства
    const handlePointerCancel = (event: PointerEvent) => {
      const deviceId = deviceIdRef.current.get(event.pointerId);
      if (deviceId) {
        deviceIdRef.current.delete(event.pointerId);
        pointerIdsRef.current.delete(event.pointerId);
        setCursors(prev => prev.filter(c => c.deviceId !== deviceId));
      }
    };

    // Добавляем слушатели событий
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointercancel', handlePointerCancel);

    // Для отладки - вывести информацию о подключенных устройствах
    console.log('Активные указатели:', pointerIdsRef.current.size);

    // Периодическая очистка "призрачных" курсоров
    const cleanupInterval = setInterval(() => {
      setCursors(prev => {
        const now = Date.now();
        return prev.filter(c => now - c.timestamp < 2000);
      });
    }, 1000);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointercancel', handlePointerCancel);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none z-50 ${className}`}>
      {cursors.map(cursor => (
        <div
          key={cursor.id}
          className="absolute w-6 h-6 transition-all duration-75 ease-out pointer-events-none"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Курсор мыши */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3L19 12L12 13L9 20L5 3Z"
              fill={cursor.color}
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          
          {/* Номер/метка курсора */}
          <span 
            className="absolute top-5 left-5 bg-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2"
            style={{ borderColor: cursor.color, color: cursor.color }}
          >
            {Array.from(deviceIdRef.current.values()).indexOf(cursor.deviceId) + 1}
          </span>
        </div>
      ))}
      
      {/* Отладочная информация - количество подключенных устройств */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Устройств: {pointerIdsRef.current.size}
      </div>
    </div>
  );
};

export default MultiCursor;
