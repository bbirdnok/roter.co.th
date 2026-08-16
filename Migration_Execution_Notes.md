# บันทึกการดำเนินการย้ายไป Cloudflare D1 Free

**สถานะ:** กำลังเตรียมเวอร์ชันแยกจากเว็บไซต์ที่เผยแพร่ปัจจุบัน โดยยังไม่แก้ไข DNS หรือเว็บที่ให้บริการอยู่

## การยืนยันต้นทาง

- วันที่ 16 สิงหาคม 2026 ได้ตรวจสอบ `https://roter.co.th` แล้ว เว็บไซต์หน้าแรกเผยแพร่และเข้าถึงได้
- สร้าง working branch `cloudflare-d1-free` จาก Git commit `d4eb01e` ซึ่งเป็นเวอร์ชันเว็บไซต์ก่อนเอกสาร migration และเป็น source baseline สำหรับการย้าย
- GitHub repository ปลายทางคือ `bbirdnok/roter.co.th`

## Cloudflare

Cloudflare connector และ Cloudflare Worker Bindings ได้รับการเปิดใช้งานแล้ว โดยยืนยันว่า zone `roter.co.th` มีสถานะ active และยังไม่มีการแก้ไข DNS ระหว่างการย้ายครั้งนี้

| ทรัพยากร | ค่า/สถานะ |
|---|---|
| D1 database | `roter-thailand-leads` |
| D1 database ID | `383d7e4d-72d7-476d-bc05-27766f32e969` |
| D1 region | APAC |
| Schema | ตาราง `leads` และ index `idx_leads_status_created_at` ถูกสร้างแล้ว โดยยังไม่มีข้อมูล lead ถูกย้ายหรือเพิ่มเข้าไป |
| Turnstile widget | `Roter Thailand Contact Form` แบบ managed สำหรับ `roter.co.th` และ `www.roter.co.th` |
| Turnstile site key | `0x4AAAAAAERfTx1n7pMNw8id` (เป็น public key; secret ไม่ถูกเก็บใน repository) |
| Cloudflare Pages project | `roter-thailand-d1` ที่ `roter-thailand-d1.pages.dev` |
| Pages D1 binding | `DB` ชี้ไปยัง `roter-thailand-leads` ทั้ง preview และ production configs |
| GitHub branch | `cloudflare-d1-free` บน `bbirdnok/roter.co.th` commit `fa8883c` |

Pages project ถูกสร้างเป็น direct-upload project เพื่อแยกจากเว็บไซต์จริง และยังไม่มี deployment หรือ custom domain โดยคำขอสร้าง Git-connected Pages project ผ่าน API ไม่สำเร็จ จึงต้องเชื่อม repository ผ่าน Cloudflare Dashboard หรือทำ direct deployment ต่อในขั้นถัดไป

## Git-connected Pages deployment

สร้าง Cloudflare Pages project เพิ่มชื่อ `roter-thailand-github-d1` และเชื่อมกับ GitHub repository `bbirdnok/roter.co.th` โดยกำหนด branch `cloudflare-d1-free` เป็น production branch ของ project แยกนี้ Pages project นี้อยู่ที่ `roter-thailand-github-d1.pages.dev`, ใช้ D1 binding `DB` และยังไม่มี custom domain ดังนั้นจึงไม่กระทบ `roter.co.th` หรือ `www.roter.co.th` ที่ให้บริการผ่าน Manus อยู่ในปัจจุบัน
