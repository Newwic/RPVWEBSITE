# RPV Supabase Admin Setup

ใช้เมื่อต้องการให้หน้า `admin/` บันทึกสินค้าออนไลน์ และให้หน้าเว็บดึงสินค้าจาก Supabase แทนไฟล์ static

## 1. สร้างฐานข้อมูล

1. เปิด Supabase project
2. ไปที่ SQL Editor
3. Run ไฟล์ `supabase/001_admin_schema.sql`

## 2. สร้างผู้ใช้ Admin

1. ไปที่ Authentication > Users
2. Add user ด้วย email/password ที่จะใช้เข้า `admin/login.html`
3. copy `User UID`
4. Run SQL นี้ โดยเปลี่ยนค่า UID และชื่อ:

```sql
insert into public.admin_profiles (user_id, display_name, role, status)
values ('USER_UID_HERE', 'RPV Admin', 'super_admin', 'active')
on conflict (user_id)
do update set role = excluded.role, status = excluded.status;
```

## 3. ใส่ค่า public config

แก้ไฟล์ `admin/config.js`

```js
window.RPV_ADMIN_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_ANON_PUBLIC_KEY",
  demoAuth: {
    enabled: false,
    email: "",
    password: ""
  }
};
```

ห้ามใส่ service role key, database password, GitHub token หรือ secret อื่นในไฟล์นี้

## 4. นำข้อมูลสินค้าเดิมเข้า Supabase

1. เปิด `admin/login.html`
2. login ด้วย Supabase user
3. ไปที่ `admin/index.html#products`
4. แก้สินค้ารายการใดรายการหนึ่ง หรือกดบันทึกสินค้า
5. ระบบจะ upsert สินค้าทั้งหมดลง Supabase

หลังจากมีสินค้าใน Supabase แล้ว:

- `products.html` จะดึงสินค้าจาก Supabase ก่อน
- ถ้า Supabase ล่ม/ยังไม่ตั้งค่า/ยังไม่มีสินค้า เว็บจะ fallback ใช้ `data/rpv-products.js`

## 5. จัดการหน้าเว็บ

หน้า `admin/index.html#pages` บันทึก draft หน้าเว็บลง `site_settings.setting_key = 'siteDraft'`

หน้าเว็บที่อ่าน draft จาก Supabase:

- `index.html`
- `products.html`
- `about.html`
- `solutions.html`
- `contact.html`

ถ้ายังไม่ได้ตั้งค่า Supabase หน้าเว็บจะใช้ draft ใน browser (`localStorage`) หรือข้อมูล static เดิมแทน

## 6. Website analytics

หน้าเว็บ public จะบันทึก page view ลง `analytics_events` เมื่อใส่ Supabase config แล้ว

- `Supabase` = สถิติรวมจากทุกเครื่องและมือถือ
- `Local browser` = ยังไม่ได้ต่อ Supabase หรือโหลดฐานข้อมูลไม่สำเร็จ จึงเห็นเฉพาะเครื่องนี้
- ถ้ามือถือเข้าเว็บแล้วตัวเลขไม่ขึ้น ให้ตรวจว่า run SQL ล่าสุดแล้ว และ `admin/config.js` มี `supabaseUrl` กับ `supabaseAnonKey`
