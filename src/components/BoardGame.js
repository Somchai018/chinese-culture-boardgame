import React, { useState } from "react";
import Dice from "./Dice";
import boardData from "../data/boardData";

const PLAYER_COLORS = [
    "#e53935", "#ffb300", "#43a047", "#1e88e5", "#8e24aa", "#d81b60"
];

function BoardGame({ numPlayers, onRestart }) {
    const [players, setPlayers] = useState(
        Array(numPlayers).fill(0).map((_, i) => ({
            pos: 0, score: 0, color: PLAYER_COLORS[i], name: `ผู้เล่นที่ ${i + 1}`
        }))
    );
    const [turn, setTurn] = useState(0); // index ผู้เล่น
    const [rolling, setRolling] = useState(false);
    const [dice, setDice] = useState(null);
    const [rollingFace, setRollingFace] = useState(1);
    const [, setShowQuiz] = useState(false);
    const [, setShowEvent] = useState(false);
    const [quizIdx, setQuizIdx] = useState(null);
    const [quizAnswered, setQuizAnswered] = useState(false);
    const [winner, setWinner] = useState(null);
    const [eventIdx, setEventIdx] = useState(null);
    const [skipTurns, setSkipTurns] = useState(Array(numPlayers).fill(0));
    const [ans, setAns] = useState(null);
    const [zoomTo, setZoomTo] = useState(null); // ตำแหน่งที่ต้องซูมเข้า
    const [isZooming, setIsZooming] = useState(false); // กำลังซูมหรือไม่


    // เดินหมากและตรวจสอบช่องที่ไปตก
    function handleRollDice() {
        if (skipTurns[turn] > 0) {
            let newSkip = [...skipTurns];
            newSkip[turn] -= 1;
            setSkipTurns(newSkip);
            setDice(null);
            setTimeout(() => nextTurn(players), 1000);
            return;
        }
        // เพิ่มเสียงทอยลูกเต๋า
        const diceAudio = new window.Audio("/sounds/Rolling Dice.mp3");
        diceAudio.play();

        setRolling(true);
        setDice(null);

        // สุ่มเลขระหว่างหมุน
        let rollInterval = setInterval(() => {
            setRollingFace(Math.floor(Math.random() * 6) + 1);
        }, 80);

        const roll = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            clearInterval(rollInterval);
            setRolling(false);
            setDice(roll);
            // เริ่ม animation เดินทีละช่อง
            animateMove(turn, roll, () => {
                setPlayers(players => {
                    const p = [...players];
                    let newPos = p[turn].pos;
                    let passedFinish = false;
                    // ถ้าเดินวนครบกระดาน
                    if ((players[turn].pos + roll) >= boardData.length) {
                        passedFinish = true;
                    }
                    if (passedFinish) {
                        p[turn].score += 20;
                    }
                    const cell = boardData[newPos];
                    // ตรวจสอบว่าชนะหรือยัง
                    if (p[turn].score >= 100) {
                        setWinner(turn);
                        setShowQuiz(false);
                        setQuizIdx(null);
                        setShowEvent(false);
                        setEventIdx(null);
                        return p;
                    }
                    if (cell.type === "quiz") {
                        setQuizIdx(newPos);
                        setShowQuiz(true);
                        setQuizAnswered(false);
                    } else if (cell.type === "info") {
                        setQuizIdx(newPos);
                        setShowQuiz(true);
                        setQuizAnswered(true);
                    } else if (cell.type === "event") {
                        setEventIdx(newPos);
                        setShowEvent(true);
                    } else {
                        setTimeout(() => nextTurn(p), 1200);
                    }
                    return p;
                });
            });
        }, 900);
    }

    // ตอบ quiz และคิดคะแนน
    function handleQuizAnswer(ansChoice) {
        setAns(ansChoice);
        const cell = boardData[quizIdx];
        let p = [...players];
        if (ansChoice === cell.answer) {
            p[turn].score += 20;
            if (p[turn].score >= 100) {
                setWinner(turn);
                setShowQuiz(false);
                setQuizIdx(null);
                setShowEvent(false);
                setEventIdx(null);
                setPlayers(p); // อัปเดตคะแนนสุดท้าย
                return;
            }
        }
        setPlayers(p);
        setQuizAnswered(true);
    }

    // จบ quiz/info → ไปคนถัดไป
    function closeQuiz() {
        setAns(null);
        nextTurn(players);
        setShowQuiz(false);
        setQuizIdx(null);
    }

    // จบ event → ไปคนถัดไป
    function handleEvent() {
        const cell = boardData[eventIdx];
        let p = [...players];
        let newSkip = [...skipTurns];
        if (cell.effect?.score) {
            p[turn].score += cell.effect.score;
        }
        if (cell.effect?.skip) {
            newSkip[turn] += cell.effect.skip;
            setSkipTurns(newSkip);
        }
        if (cell.effect?.move) {
            let newPos = p[turn].pos + cell.effect.move;
            if (newPos >= boardData.length) newPos = boardData.length - 1;
            p[turn].pos = newPos;
        }
        setPlayers(p);
        setShowEvent(false);
        setEventIdx(null);
        setTimeout(() => nextTurn(p), 800);
    }

    // เปลี่ยนเทิร์น
    function nextTurn(p) {
        setDice(null);
        setTurn(t => (t + 1) % numPlayers);
        setPlayers(p);
    }

    function animateMove(playerIdx, steps, onFinish) {
    if (steps <= 0) {
        setIsZooming(false); // จบการซูม
        setZoomTo(null);
        onFinish && onFinish();
        return;
    }

    // 1. ดีเลย์ 1 วิ ก่อนเริ่มซูม
    setTimeout(() => {
        // 2. ซูมเข้า
        setZoomTo(players[playerIdx].pos);
        setIsZooming(true);

        // 3. เดินทีละช่อง (550ms ต่อก้าว)
        function walk(remaining) {
            if (remaining <= 0) {
                setIsZooming(false);
                setZoomTo(null);
                onFinish && onFinish();
                return;
            }
            setPlayers(players => {
                const p = [...players];
                let oldPos = p[playerIdx].pos;
                let newPos = (oldPos + 1) % boardData.length;
                p[playerIdx] = { ...p[playerIdx], pos: newPos };
                setZoomTo(newPos);
                return p;
            });
            setTimeout(() => walk(remaining - 1), 550);
        }
        walk(steps);

    }, 1000); // ดีเลย์ 1 วิ ก่อนซูมและเริ่มเดิน
}


    // Board rendering
    function renderBoard() {
        const N = 9; // ช่องละด้าน
        // วาดเป็นกรอบสี่เหลี่ยม 9x9 ด้านนอก
        let cells = Array(4 * (N - 1)).fill(null).map((_, i) => boardData[i] || {});
        // แปลง 1D เป็น 2D ตำแหน่ง x,y
        const size = N;
        let board2D = Array(size).fill(null).map(() => Array(size).fill(null));
        // ใส่ช่องรอบนอก (วนตามเข็มนาฬิกา)
        let idx = 0;
        for (let i = 0; i < size; i++) board2D[0][i] = { ...cells[idx++], pos: idx - 1 }; // top
        for (let i = 1; i < size; i++) board2D[i][size - 1] = { ...cells[idx++], pos: idx - 1 }; // right
        for (let i = size - 2; i >= 0; i--) board2D[size - 1][i] = { ...cells[idx++], pos: idx - 1 }; // bottom
        for (let i = size - 2; i > 0; i--) board2D[i][0] = { ...cells[idx++], pos: idx - 1 }; // left
        // หา position (x, y) ของช่องที่ต้องซูม
        let zoomX = 0, zoomY = 0;
        if (zoomTo != null) {
            board2D.flat().forEach((cell, i) => {
                if (cell && cell.pos === zoomTo) {
                    zoomY = Math.floor(i / size);
                    zoomX = i % size;
                }
            });
        }

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${size}, 60px)`,
                    gap: "6px 18px",
                    background: "#bdbdbd",
                    padding: 7,
                    margin: "0 auto",
                    width: `${size * 70 + (size - 1) * 8 + 10}px`,   // +14 คือ padding ซ้ายขวา
                    height: `${size * 70 + (size - 1) * 8 + 20}px`,  // +14 คือ padding บนล่าง
                    borderRadius: 12,
                    transition: "transform 0.4s cubic-bezier(.46,.03,.52,.96), box-shadow 0.4s",
                    transform: isZooming && zoomTo != null
                        ? `scale(1.7) translate(${-zoomX * 70 + 210}px, ${-zoomY * 70 + 210}px)`
                        : "scale(1) translate(0, 0)",
                    boxShadow: isZooming ? "0 10px 45px #444" : "none",
                    zIndex: isZooming ? 100 : "auto",
                }}
            >
                {board2D.flat().map((cell, i) => (
                    <div key={i} style={{
                        width: 70,
                        height: 70,
                        background: cell && cell.color ? cell.color : "#fff", // เปลี่ยนจาก #fff เป็น #ffe0b2 (สีพื้นหลัง)
                        border: cell && cell.color ? "2px solid #888" : "none",  // เฉพาะช่องเดินเท่านั้นที่มี border
                        borderRadius: 7,
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {/* รูปภาพช่อง */}
                        {cell && cell.image &&
                            <img src={`/images/${cell.image}`} alt="" style={{ width: "90%", height: "90%", objectFit: "contain", position: "absolute", left: "5%", top: "5%" }} />
                        }
                        {/* หมายเลขช่อง */}
                        {cell && (
                            <span style={{ fontSize: 14, position: "absolute", top: 2, left: 4 }}>{cell.pos + 1}</span>
                        )}
                        {/* หมากผู้เล่น */}
                        {players
                            .map((p, idx) => ({ ...p, idx }))
                            .filter(p => p.pos === cell?.pos)
                            .map((p, order, arr) => {
                                // วางเป็นวงกลมในช่อง
                                const total = arr.length;
                                const center = 35; // center of cell (70x70)
                                const radius = 18; // ระยะห่างจากจุดศูนย์กลาง
                                let angle = (2 * Math.PI * order) / total;
                                let left = center + radius * Math.cos(angle) - 20; // 20 = icon size/2
                                let top = center + radius * Math.sin(angle) - 20;
                                if (total === 1) { left = 15; top = 15; } // ถ้ามีตัวเดียว ให้อยู่กลางช่อง
                                return (
                                    <img
                                        key={p.idx}
                                        src={`/images/player_${p.idx + 1}.png`}
                                        alt={`player${p.idx + 1}`}
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            position: "absolute",
                                            left,
                                            top,
                                            zIndex: 10 + order
                                        }}
                                    />
                                );
                            })}
                    </div>
                ))}
            </div>
        );
    }


    // Panel แสดงสถานะ
    function renderStatus() {
        return (
            <div style={{
                position: "relative",
                right: -100,
                background: "#fff3e0",
                padding: "30px 50px",
                borderRadius: 18,
                margin: "15px auto",
                width: 500,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 2px 7px #eed",
                border: "5px solid rgb(231, 77, 60) ",
            }}>
                <div style={{ marginBottom: 30, fontSize: "1.9rem", fontWeight: 600 }}>
                    <strong style={{ color: players[turn].color }}>เทิร์นของ {players[turn].name}</strong>
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 12, justifyContent: "center" }}>
                    {players.map((p, idx) =>
                        <div key={idx} style={{
                            background: p.color,
                            color: "#fff",
                            padding: "7px 14px",
                            borderRadius: 15,
                            fontWeight: 500,
                            fontSize: "1.25rem",
                            boxShadow: "0 1px 5px #bbb",
                            textAlign: "center", // เพิ่มบรรทัดนี้
                            minWidth: 170        // เพิ่มความกว้างขั้นต่ำให้ดูสมดุล
                        }}>
                            {p.name} : {p.score} คะแนน
                        </div>
                    )}
                </div>
                <div>
                    <span style={{ fontSize: "1.5rem", fontWeight: 500 }}>ลูกเต๋า :</span>
                    <span style={{ fontSize: "2.5rem", fontWeight: 700, marginLeft: 10 }}>
                        {dice ? dice : "-"}
                    </span>
                </div>
                {!dice && !winner &&
                    <button
                        style={{
                            marginTop: 10, fontSize: "1.3rem", padding: "8px 30px", background: "#43a047",
                            color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer"
                        }}
                        onClick={handleRollDice}
                    >ทอยลูกเต๋า</button>
                }
            </div>
        );
    }

    // Quiz/info popup
    function renderQuizPopup() {
        if (quizIdx === null) return null;
        const cell = boardData[quizIdx];
        return (
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.22)", zIndex: 99,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <div style={{
                    background: "#fff", padding: "35px 25px 22px", borderRadius: 18,
                    minWidth: 310, boxShadow: "0 5px 30px #888", textAlign: "center"
                }}>
                    {cell.type === "info" ? (
                        <>
                            {cell.image &&
                                <img
                                    src={`/images/${cell.image}`}
                                    alt=""
                                    style={{ width: 120, height: 120, objectFit: "contain", marginBottom: 15 }}
                                />
                            }
                            <div style={{ fontSize: "1.5rem", marginBottom: 16, color: "#00796b" }}>
                                {cell.text}
                            </div>
                            <button style={{ marginTop: 8, padding: "8px 25px", borderRadius: 10, fontSize: "1.25rem", background: "#00897b", color: "#fff", border: "none" }}
                                onClick={closeQuiz}
                            >ต่อไป</button>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: "1.5rem", marginBottom: 12, color: "#1c2833", fontWeight: 600 }}>
                                {cell.question}
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                {cell.choices.map((ch, i) =>
                                    <button
                                        key={i}
                                        onClick={() => !quizAnswered && handleQuizAnswer(ch)}
                                        disabled={quizAnswered}
                                        style={{
                                            margin: "0 10px 6px 0", fontSize: "1.25rem",
                                            background: quizAnswered
                                                ? (ch === cell.answer
                                                    ? "#43a047" // ถูก: เขียว
                                                    : (ch === ans && ch !== cell.answer ? "#e53935" : "#fff8e1")) // ผิด: แดง, อื่นๆ: สีเดิม
                                                : "#fff8e1",
                                            color: quizAnswered
                                                ? (ch === cell.answer
                                                    ? "#fff"
                                                    : (ch === ans && ch !== cell.answer ? "#fff" : "#bf360c"))
                                                : "#bf360c",
                                            border: quizAnswered
                                                ? (ch === cell.answer
                                                    ? "2px solid #388e3c"
                                                    : (ch === ans && ch !== cell.answer ? "2px solid #b71c1c" : "1px solid #fbc02d"))
                                                : "1px solid #fbc02d",
                                            borderRadius: 9, padding: "7px 19px", fontWeight: 600, cursor: "pointer"
                                        }}
                                    >{ch}</button>
                                )}
                            </div>
                            {quizAnswered &&
                                <div>
                                    {players[turn].score >= 100
                                        ? <span style={{ color: "#43a047", fontWeight: 700 }}>คุณชนะแล้ว!</span>
                                        : <button
                                            style={{
                                                padding: "7px 23px", borderRadius: 9, fontSize: "1.25rem", background: "#00bfae",
                                                color: "#fff", border: "none", fontWeight: 600, marginTop: 6
                                            }}
                                            onClick={closeQuiz}
                                        >ต่อไป</button>
                                    }
                                </div>
                            }
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Event popup
    function renderEventPopup() {
        if (eventIdx === null) return null;
        const cell = boardData[eventIdx];
        return (
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.22)", zIndex: 99,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <div style={{
                    background: "#fff", padding: "35px 25px 22px", borderRadius: 18,
                    minWidth: 310, boxShadow: "0 5px 30px #888", textAlign: "center"
                }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: 16, color: "#c2185b" }}>
                        {cell.text}
                    </div>
                    <button style={{ marginTop: 8, padding: "8px 25px", borderRadius: 10, fontSize: "1.25rem", background: "#c2185b", color: "#fff", border: "none" }}
                        onClick={handleEvent}
                    >ต่อไป</button>
                </div>
            </div>
        );
    }

    // Winner popup
    function renderWinner() {
        if (winner === null) return null;
        return (
            <div style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.21)", zIndex: 200,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <div style={{
                    background: "#fff", padding: "40px 40px 25px", borderRadius: 20,
                    boxShadow: "0 4px 35px #888", textAlign: "center"
                }}>
                    <div style={{ fontSize: "2rem", color: "#e53935", fontWeight: 800, marginBottom: 10 }}>
                        🎉 {players[winner].name} ชนะแล้ว!
                    </div>
                    <button style={{
                        padding: "10px 35px", borderRadius: 13, fontSize: "1.2rem",
                        background: "#d35400", color: "#fff", border: "none", fontWeight: 700, marginTop: 15
                    }} onClick={onRestart}>
                        กลับหน้าแรก
                    </button>
                </div>
            </div>
        );
    }

    // --- MAIN RENDER
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.47), rgba(255,255,255,0.47)), url("/images/bg_pattern.jpg")',
                backgroundSize: "cover",
                backgroundAttachment: "fixed",
                padding: 0,
                position: "relative",
                fontFamily: "Kanit, sans-serif"
            }}
        >
            {/* ปุ่มย้อนกลับ */}
            <button
                onClick={onRestart}
                style={{
                    position: "absolute",
                    top: 60,
                    left: 40,
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 26px",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    zIndex: 1000
                }}
            >
                ⬅ ย้อนกลับ
            </button>

            <div style={{ maxWidth: 1600, margin: "0 auto", padding: "30px 0" }}>
                <div style={{ textAlign: "center" }}>
                    <img
                        src="/images/logo.gif"
                        alt="เดินทางสู่แดนมังกร"
                        style={{ width: 700, maxWidth: "90%", margin: "0 auto", marginBottom: 10, display: "block" }}
                    />
                </div>

                {/* ======== ส่วน flex-row ของกระดาน+panel+ลูกเต๋า ======== */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: 10,
                        position: "relative"
                    }}
                >
                    {/* กล่องกระดาน+ลูกเต๋า */}
<div style={{ position: "relative" }}>
  {renderBoard()}
  {/* ลูกเต๋าอยู่ตรงกลางกระดาน และจะซ่อนตอนซูม */}
  {(rolling || dice) && !isZooming && (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 200,
        pointerEvents: "none"
      }}
    >
      <Dice value={rolling ? rollingFace : dice || 1} rolling={rolling} />
    </div>
  )}
</div>

                    {/* Status Panel */}
                    {renderStatus()}
                </div>

                {/* Quiz/Event/Winner Popup */}
                {renderQuizPopup()}
                {renderEventPopup()}
                {renderWinner()}
            </div>
        </div>
    );

}
export default BoardGame;