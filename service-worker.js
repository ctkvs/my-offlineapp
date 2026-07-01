const CACHE_NAME = 'offline-app-v1';
// รายชื่อไฟล์ที่ต้องการให้เปิดแบบออฟไลน์ได้ (ถ้ามีไฟล์รูปภาพหรือ CSS อื่นๆ ให้ใส่เพิ่มในนี้ได้)
const ASSETS_TO_CACHE = [
  './',
  './index.html'
];

// 1. ติดตั้งและบันทึกไฟล์ลงเครื่องเก็บไว้ทำออฟไลน์
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ลบแคชเวอร์ชันเก่าออกเมื่อมีการอัปเดตระบบ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. ดึงไฟล์จากในเครื่องมาแสดงผลทันที (แม้ไม่มีอินเทอร์เน็ต)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ถ้ามีไฟล์ในเครื่องให้ใช้ในเครื่อง ถ้าไม่มีค่อยดึงจากเน็ต
      return cachedResponse || fetch(event.request);
    })
  );
});
