
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
  zoneId?: number;
  isClicking: boolean;
}

interface GameZone {
  id: number;
  element: HTMLElement;
  rect: DOMRect;
}

// Компонент для отображения нескольких курсоров при подключении нескольких мышей
const MultiCursor = ({ className }: MultiCursorProps) => {
  const [cursors, setCursors] = useState<CursorData[]>([]);
  const [gameZones, setGameZones] = useState<GameZone[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceIdRef = useRef<Map<number, string>>(new Map());
  const cursorColorsRef = useRef<Map<string, string>>(new Map());
  const pointerIdsRef = useRef<Set<number>>(new Set());
  const deviceToZoneRef = useRef<Map<string, number>>(new Map());
  
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
      
      // Назначаем зону для нового устройства
      assignZoneToDevice(newId);
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
  
  // Назначение игровой зоны для устройства
  const assignZoneToDevice = (deviceId: string) => {
    // Если у нас есть доступные зоны и устройство еще не привязано
    if (gameZones.length > 0 && !deviceToZoneRef.current.has(deviceId)) {
      // Назначаем следующую доступную зону
      const deviceCount = deviceToZoneRef.current.size;
      const zoneIndex = deviceCount % gameZones.length;
      deviceToZoneRef.current.set(deviceId, gameZones[zoneIndex].id);
    }
  };
  
  // Поиск и обновление игровых зон
  const updateGameZones = () => {
    // Ищем все игровые области на странице
    const gameAreaElements = document.querySelectorAll('[data-game-area]');
    
    if (gameAreaElements.length > 0) {
      const zones: GameZone[] = [];
      
      gameAreaElements.forEach((element, index) => {
        const gameArea = element as HTMLElement;
        const rect = gameArea.getBoundingClientRect();
        const zoneId = parseInt(gameArea.getAttribute('data-player-id') || `${index + 1}`, 10);
        
        zones.push({
          id: zoneId,
          element: gameArea,
          rect: rect
        });
      });
      
      setGameZones(zones);
    }
  };
  
  // Ограничивает координаты курсора в рамках указанной зоны
  const constrainToZone = (x: number, y: number, deviceId: string): { x: number, y: number } => {
    const zoneId = deviceToZoneRef.current.get(deviceId);
    
    // Если устройство привязано к зоне
    if (zoneId !== undefined) {
      const zone = gameZones.find(z => z.id === zoneId);
      
      if (zone) {
        // Получаем актуальные размеры зоны
        const rect = zone.element.getBoundingClientRect();
        
        // Добавляем немного отступа от границ зоны
        const padding = 10;
        const containerRect = containerRef.current?.getBoundingClientRect();
        
        if (containerRect) {
          // Пересчитываем координаты относительно контейнера
          const relX = rect.left - containerRect.left + padding;
          const relY = rect.top - containerRect.top + padding;
          const maxX = rect.right - containerRect.left - padding;
          const maxY = rect.bottom - containerRect.top - padding;
          
          // Ограничиваем координаты в пределах зоны
          return {
            x: Math.min(Math.max(x, relX), maxX),
            y: Math.min(Math.max(y, relY), maxY)
          };
        }
      }
    }
    
    // Если нет привязки к зоне, возвращаем исходные координаты
    return { x, y };
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Инициализация и обновление игровых зон
    updateGameZones();
    
    // Обновляем зоны при изменении размеров окна
    const handleResize = () => {
      updateGameZones();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Обновляем зоны каждые 2 секунды на случай, если DOM изменился
    const zonesInterval = setInterval(updateGameZones, 2000);
    
    const handlePointerMove = (event: PointerEvent) => {
      // Проверяем, что это мышь или стилус (не сенсорное касание)
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        const deviceId = getDeviceId(event.pointerId);
        const color = getColorForDevice(deviceId);
        
        // Вычисляем координаты относительно контейнера
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        // Ограничиваем координаты курсора в рамках зоны
        const constrained = constrainToZone(x, y, deviceId);
        x = constrained.x;
        y = constrained.y;
        
        // Обновляем состояние курсоров
        setCursors(prev => {
          // Находим курсор для данного deviceId
          const cursorIndex = prev.findIndex(c => c.deviceId === deviceId);
          const now = Date.now();
          
          // Удаляем устаревшие курсоры
          const filtered = prev.filter(c => now - c.timestamp < 2000);
          
          // Зона, к которой привязан курсор
          const zoneId = deviceToZoneRef.current.get(deviceId);
          
          // Если курсор существует, обновляем его
          if (cursorIndex !== -1) {
            return filtered.map(c => 
              c.deviceId === deviceId 
                ? { ...c, x, y, timestamp: now, zoneId } 
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
            timestamp: now,
            zoneId,
            isClicking: false
          }];
        });
      }
    };
    
    // Обработчик начала взаимодействия с указателем (клик)
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
        const deviceId = getDeviceId(event.pointerId);
        
        // Устанавливаем состояние клика
        setCursors(prev => 
          prev.map(c => 
            c.deviceId === deviceId 
              ? { ...c, isClicking: true } 
              : c
          )
        );
        
        // Сбрасываем состояние клика через короткое время
        setTimeout(() => {
          setCursors(prev => 
            prev.map(c => 
              c.deviceId === deviceId 
                ? { ...c, isClicking: false } 
                : c
            )
          );
        }, 200);
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
        deviceToZoneRef.current.delete(deviceId);
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

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('resize', handleResize);
      clearInterval(zonesInterval);
    };
  }, [gameZones]);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none z-50 ${className}`}>
      {cursors.map(cursor => (
        <div
          key={cursor.id}
          className={`absolute transition-all duration-75 ease-out pointer-events-none
            ${cursor.isClicking ? 'scale-90' : 'scale-100'}`}
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transform: 'translate(-50%, -50%)',
            filter: cursor.isClicking ? 'brightness(1.2)' : 'brightness(1)'
          }}
        >
          {/* Анимация клика */}
          {cursor.isClicking && (
            <div className="absolute inset-0 -m-1 rounded-full animate-ping-fast opacity-70"
              style={{ backgroundColor: cursor.color }}
            />
          )}
          
          {/* Курсор мыши */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cursor.isClicking ? 'scale-90' : 'scale-100'}
            style={{ transition: 'all 0.1s ease-out' }}
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
            {cursor.zoneId || Array.from(deviceIdRef.current.values()).indexOf(cursor.deviceId) + 1}
          </span>
        </div>
      ))}
      
      {/* Отладочная информация - количество подключенных устройств и зон */}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 text-xs rounded">
        Устройств: {pointerIdsRef.current.size} | Зон: {gameZones.length}
      </div>
    </div>
  );
};

export default MultiCursor;
