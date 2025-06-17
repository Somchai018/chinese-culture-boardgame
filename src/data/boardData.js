const boardData = [
  // ด้านบน 0-8
  { type: "start", text: "เริ่ม", color: "#fffde7", image: "start.png" }, // 0
  { type: "quiz", question: "เทศกาลไหนถือเป็นปีใหม่ของจีน?", choices: ["ตรุษจีน", "เช็งเม้ง", "ไหว้พระจันทร์"], answer: "ตรุษจีน", color: "#ffe0b2", image: "forbidden_city.png" }, // 1
  { type: "info", text: "ประเพณีแจกอั่งเปา สื่อถึงโชคลาภ", color: "#ffe0b2", image: "info2.png" }, // 2
  { type: "quiz", question: "อาหารชนิดใดถือว่าเป็นมงคลในวันตรุษจีน?", choices: ["ปลา", "ขนมไหว้พระจันทร์", "บ๊ะจ่าง"], answer: "ปลา", color: "#fff9c4", image: "fish.png" }, // 3
  { type: "info", text: "เทศกาลโคมไฟ ปล่อยโคมไฟและกินบัวลอย", color: "#b2dfdb", image: "info3.png" }, // 4
  { type: "quiz", question: "เทศกาลใดที่คนจีนนิยมกินบัวลอย?", choices: ["โคมไฟ", "เช็งเม้ง", "ไหว้พระจันทร์"], answer: "โคมไฟ", color: "#ffe082", image: "tangyuan.png" }, // 5
  { type: "event", text: "ได้รับอั่งเปา รับแต้มเพิ่ม 20!", color: "#f8bbd0", image: "lucky_money.png", effect: { score: 20 } }, // 6
  { type: "info", text: "กำแพงเมืองจีน มรดกโลก", color: "#bbdefb", image: "info4.png" }, // 7
  { type: "quiz", question: "กำแพงเมืองจีนยาวกว่า 20,000 กม. จริงหรือไม่?", choices: ["จริง", "ไม่จริง"], answer: "จริง", color: "#dcedc8", image: "great_wall2.png" }, // 8

  // ขวา 9-17
  { type: "info", text: "ประเพณีเช็งเม้ง ลูกหลานไปไหว้สุสาน", color: "#fff9c4", image: "info5.png" }, // 9
  { type: "quiz", question: "เช็งเม้งคือเทศกาลเกี่ยวกับอะไร?", choices: ["ไหว้บรรพบุรุษ", "แข่งเรือ", "กินขนม"], answer: "ไหว้บรรพบุรุษ", color: "#ffe0b2", image: "angpao.png" }, // 10
  { type: "info", text: "บ๊ะจ่าง อาหารประจำเทศกาลเรือมังกร", color: "#d7ccc8", image: "info6.png" }, // 11
  { type: "quiz", question: "เรือมังกรจัดขึ้นเพื่อระลึกถึงใคร?", choices: ["ชวีหยวน", "ขงจื้อ", "ฉางเอ๋อ"], answer: "ชวีหยวน", color: "#e1bee7", image: "quyuan.png" }, // 12
  { type: "event", text: "โชคร้าย! ข้ามเทิร์น 1 ครั้ง", color: "#f8bbd0", image: "badluck.png", effect: { skip: 1 } }, // 13
  { type: "quiz", question: "เทศกาลเรือมังกรนิยมกินอะไร?", choices: ["บ๊ะจ่าง", "เกี๊ยว", "เป็ดปักกิ่ง"], answer: "บ๊ะจ่าง", color: "#ffe0b2", image: "zongzi2.png" }, // 14
  { type: "info", text: "พระราชวังต้องห้าม กรุงปักกิ่ง", color: "#ffe082", image: "info7.png" }, // 15
  { type: "quiz", question: "เป็ดปักกิ่งเป็นอาหารเด่นของเมืองใด?", choices: ["ปักกิ่ง", "เซี่ยงไฮ้", "กวางโจว"], answer: "ปักกิ่ง", color: "#d1c4e9", image: "peking_duck.png" }, // 16
  { type: "event", text: "คุณได้ท่องเที่ยวเมืองจีน รับแต้ม 10!", color: "#b2dfdb", image: "bonus.png", effect: { score: 10 } }, // 17

  // ล่าง 18-26 (วนขวา→ซ้าย)
  { type: "quiz", question: "เทศกาลใดที่คนจีนชมพระจันทร์และกินขนม?", choices: ["ไหว้พระจันทร์", "ตรุษจีน", "เช็งเม้ง"], answer: "ไหว้พระจันทร์", color: "#e1bee7", image: "moon_festival.png" }, // 18
  { type: "info", text: "ขนมไหว้พระจันทร์ มีหลากหลายไส้", color: "#fff9c4", image: "info8.png" }, // 19
  { type: "quiz", question: "ตำนานใดเกี่ยวกับเทศกาลไหว้พระจันทร์?", choices: ["ฉางเอ๋อ", "ชวีหยวน", "หยกขาว"], answer: "ฉางเอ๋อ", color: "#ffe0b2", image: "fish.png" }, // 20
  { type: "event", text: "เดินหน้า 2 ช่อง", color: "#bbdefb", image: "go2.png", effect: { move: 2 } }, // 21
  { type: "quiz", question: "เมืองใดมีตึกสูงสุดในจีน?", choices: ["เซี่ยงไฮ้", "ปักกิ่ง", "ซีอาน"], answer: "เซี่ยงไฮ้", color: "#c8e6c9", image: "tangyuan.png" }, // 22
  { type: "info", text: "ดนตรีจีน เครื่องสายกู่เจิ้ง", color: "#d7ccc8", image: "info9.png" }, // 23
  { type: "event", text: "ได้รับแต้มพิเศษ 15", color: "#b2dfdb", image: "bonus.png", effect: { score: 15 } }, // 24
  { type: "info", text: "เส้นบะหมี่ หมายถึงอายุยืน", color: "#ffe0b2", image: "info12.png" }, // 25
  { type: "quiz", question: "อาหารชนิดใดหมายถึงโชคลาภในงานแต่งจีน?", choices: ["ปลา", "เกี๊ยว", "หมู"], answer: "ปลา", color: "#e1bee7", image: "zongzi.png" }, // 26

  // ซ้าย 27-35 (วนล่าง→บน)
  { type: "info", text: "ประเพณีแต่งกายชุดกี่เพ้า", color: "#fff9c4", image: "info10.png" }, // 27
  { type: "quiz", question: "กี่เพ้าเป็นชุดประจำชาติของกลุ่มชาติพันธุ์ใด?", choices: ["ฮั่น", "แมนจู", "มองโกล"], answer: "แมนจู", color: "#ffe0b2", image: "great_wall2.png" }, // 28
  { type: "info", text: "การแสดงงิ้วจีน", color: "#bbdefb", image: "info11.png" }, // 29
  { type: "event", text: "ข้ามไปหน้าถัดไปทันที!", color: "#f8bbd0", image: "lucky_money.png", effect: { move: 1 } }, // 30
  { type: "quiz", question: "ขนมที่นิยมในเทศกาลโคมไฟ?", choices: ["บัวลอย", "ซาลาเปา", "เป็ดย่าง"], answer: "บัวลอย", color: "#d1c4e9", image: "peking_duck.png" }, // 31 
];
export default boardData;