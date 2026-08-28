"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  stage: string;
  kicker: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  basis: string;
  skill: "판단력" | "의구심" | "효율성";
};

const questions: Question[] = [
  {
    stage: "계획 단계",
    kicker: "FIRST MOVE",
    prompt: "SI 프로젝트 매출의 진행률을 검토하려 합니다. 가장 먼저 요청할 자료 묶음은?",
    choices: [
      "법인카드 명세와 임직원 경비 정산서",
      "프로젝트별 계약서, 총예정원가 산출 근거, 실제 원가 투입 내역",
      "유형자산 취득명세와 감가상각 스케줄",
    ],
    answer: 1,
    explanation: "진행률은 누적발생원가와 총예정원가에 직접 좌우됩니다. 계약 조건, 총예정원가의 승인·변경 근거, 실제 투입원가를 연결해야 위험에 대응할 수 있습니다.",
    basis: "감사기준서 315 · 330 · 500",
    skill: "효율성",
  },
  {
    stage: "위험 평가",
    kicker: "FOLLOW THE RISK",
    prompt: "당기 프로젝트의 총예정원가가 반복해서 하향 조정되었습니다. 우선 집중할 재무제표 계정은?",
    choices: [
      "계약자산·매출·매출원가와 손실충당부채",
      "현금및현금성자산과 단기금융상품",
      "자본금과 주식발행초과금",
      "퇴직급여채무와 기타포괄손익",
    ],
    answer: 0,
    explanation: "총예정원가 하향은 진행률과 당기 매출·이익을 높일 수 있습니다. 계약자산, 누적 매출·원가, 손실 프로젝트 충당 여부를 프로젝트 단위로 연결해 봐야 합니다.",
    basis: "감사기준서 240 · 315 · K-IFRS 1115",
    skill: "의구심",
  },
  {
    stage: "통제 테스트",
    kicker: "TEST THE CONTROL",
    prompt: "진행률 산정 프로세스에서 가장 설득력 있는 핵심통제 조합은?",
    choices: [
      "매월 매출 합계가 전월보다 증가하는지 확인",
      "프로젝트 매니저가 본인 산출물을 스스로 승인",
      "총예정원가 변경의 독립적 승인과 원가 데이터 인터페이스 완전성 검증",
    ],
    answer: 2,
    explanation: "추정 변경은 독립적인 검토·승인이 필요하고, 진행률 계산에 들어가는 원가 데이터의 완전성과 정확성도 함께 통제되어야 합니다.",
    basis: "감사기준서 315 · 330 · 540",
    skill: "판단력",
  },
  {
    stage: "핵심감사사항",
    kicker: "WHAT MATTERED MOST",
    prompt: "2023년 연결감사에서 핵심감사사항으로 가장 타당한 항목은?",
    choices: [
      "SI 서비스 진행률 계산의 적정성",
      "사무실 비품의 내용연수",
      "보통주 주당 액면가 표시",
      "현금배당 지급일의 주석 문구",
    ],
    answer: 0,
    explanation: "실제 2023년 연결감사보고서는 미래 노무비·외주비 추정과 프로젝트 변경에 경영진의 판단이 크게 개입한다는 점에서 SI 서비스 진행률 산정을 핵심감사사항으로 정했습니다.",
    basis: "감사기준서 701",
    skill: "판단력",
  },
  {
    stage: "보고 단계",
    kicker: "SIGN YOUR OPINION",
    prompt: "충분하고 적합한 증거를 확보했고 중요왜곡표시가 발견되지 않았습니다. 최종 보고 조합은?",
    choices: [
      "적정의견 · 계속기업 중요 불확실성 없음 · 연결 내부회계 적정",
      "한정의견 · 계속기업 중요 불확실성 있음 · 내부회계 의견거절",
      "부적정의견 · 강조사항으로 SI 매출 표시",
      "의견거절 · 핵심감사사항은 기재하지 않음",
    ],
    answer: 0,
    explanation: "실제 보고서의 결론은 연결재무제표 적정의견, 연결 내부회계관리제도 적정의견입니다. 계속기업 관련 중요한 불확실성도 보고되지 않았습니다.",
    basis: "감사기준서 570 · 700 · 외감법",
    skill: "판단력",
  },
];

const ranks = [
  { min: 0, title: "New Staff", year: "1년차" },
  { min: 200, title: "Associate", year: "2년차" },
  { min: 500, title: "Senior Associate", year: "3년차" },
  { min: 900, title: "Senior", year: "4년차" },
  { min: 1500, title: "Manager", year: "6년차" },
  { min: 2400, title: "Senior Manager", year: "8년차+" },
];

function rankFor(xp: number) {
  return [...ranks].reverse().find((rank) => xp >= rank.min) ?? ranks[0];
}

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const [xp, setXp] = useState(120);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem("audit-room-xp");
    if (saved) setXp(Number(saved));
  }, []);

  const question = questions[current];
  const rank = rankFor(xp);
  const nextRank = ranks.find((item) => item.min > xp);
  const nextProgress = nextRank
    ? Math.min(100, ((xp - rank.min) / (nextRank.min - rank.min)) * 100)
    : 100;

  const stats = useMemo(() => {
    const answered = submitted ? current + 1 : current;
    return {
      판단력: 62 + answered * 4,
      의구심: 58 + answered * 5,
      효율성: 60 + Math.round((score / 100) * 20),
    };
  }, [current, score, submitted]);

  function advance() {
    if (!submitted) {
      if (selected === null) return;
      setSubmitted(true);
      if (selected === question.answer) setScore((value) => value + 20);
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((value) => value + 1);
      setSelected(null);
      setSubmitted(false);
      return;
    }

    const finalScore = score;
    const gain = 40 + finalScore;
    const newXp = xp + gain;
    setScore(finalScore);
    setEarnedXp(gain);
    setXp(newXp);
    window.localStorage.setItem("audit-room-xp", String(newXp));
    setComplete(true);
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setComplete(false);
    setEarnedXp(0);
  }

  const choiceState = (index: number) => {
    if (!submitted) return selected === index ? "selected" : "";
    if (index === question.answer) return "correct";
    if (selected === index) return "wrong";
    return "muted";
  };

  return (
    <main className="game-shell">
      <header className="topbar">
        <button className="brand" onClick={restart} aria-label="처음으로">
          <span>／A</span> AUDIT ROOM
        </button>
        <nav aria-label="주요 메뉴">
          <button className="nav-active">Engagement</button>
          <button onClick={() => document.querySelector(".career-strip")?.scrollIntoView({ behavior: "smooth" })}>Career</button>
          <button onClick={() => setSourcesOpen(true)}>Source notes</button>
        </nav>
        <div className="profile">
          <div><small>{rank.title.toUpperCase()} · {rank.year}</small><strong>{xp.toLocaleString()} XP</strong></div>
          <div className="avatar">A</div>
        </div>
      </header>

      <section className="case-head">
        <div>
          <p className="eyebrow">LIVE ENGAGEMENT · CASE 01</p>
          <h1>숫자를 믿지 말고,<br /><em>증거를 믿으세요.</em></h1>
          <p className="lead">삼성SDS의 2023년 연결감사. 공개된 사업보고서와 감사보고서의 단서를 따라 최종의견까지 완성하세요.</p>
        </div>
        <div className="case-stamp" aria-label="2023 회계연도 TMT Technology 사건">
          <span>FY</span><strong>2023</strong><small>TMT · TECHNOLOGY</small>
        </div>
      </section>

      {!complete ? (
        <section className="workspace" aria-live="polite">
          <aside className="case-file">
            <p className="section-label">CLIENT BRIEF</p>
            <div className="client-title"><span>018260</span><h2>삼성SDS</h2></div>
            <p>IT 서비스 · 물류<br />연결 재무제표</p>
            <dl>
              <div><dt>매출</dt><dd>13.28조</dd></div>
              <div><dt>영업이익</dt><dd>8,082억</dd></div>
              <div><dt>총자산</dt><dd>12.32조</dd></div>
              <div><dt>전년 매출</dt><dd>17.23조</dd></div>
            </dl>
            <div className="risk-chip">ESTIMATION RISK <b>HIGH</b></div>
            <p className="data-note">단위 반올림 · 2023 연결 기준</p>
          </aside>

          <article className="question-card">
            <div className="question-meta">
              <span>{String(current + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span>
              <span>{question.stage}</span>
            </div>
            <div className="progress-line"><i style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }} /></div>
            <p className="section-label">{question.kicker}</p>
            <h2>{question.prompt}</h2>
            <div className="choices">
              {question.choices.map((choice, index) => (
                <button
                  key={choice}
                  className={choiceState(index)}
                  onClick={() => !submitted && setSelected(index)}
                  disabled={submitted}
                  aria-pressed={selected === index}
                >
                  <b>{String.fromCharCode(65 + index)}</b><span>{choice}</span><i aria-hidden="true">{submitted && index === question.answer ? "✓" : selected === index ? "●" : ""}</i>
                </button>
              ))}
            </div>

            {submitted && (
              <div className={`feedback ${selected === question.answer ? "is-correct" : "is-wrong"}`}>
                <div><b>{selected === question.answer ? "+20 · 좋은 판단입니다" : "+0 · 감사증거를 다시 연결해 보세요"}</b><span>{question.basis}</span></div>
                <p>{question.explanation}</p>
              </div>
            )}

            <button className="primary" onClick={advance} disabled={selected === null}>
              {submitted ? (current === questions.length - 1 ? "감사보고서 발행" : "다음 감사 절차") : "판단 확정"}
              <span>→</span>
            </button>
          </article>

          <aside className="progress-card">
            <p className="section-label">YOUR TRACK</p>
            <div className="rank-ring" style={{ background: `conic-gradient(var(--acid) ${nextProgress}%, transparent 0)` }}>
              <div><span>{rank.year}</span><strong>{Math.round(nextProgress)}%</strong></div>
            </div>
            <h3>{nextRank ? `${nextRank.title}까지` : "최고 직급"}<br />{nextRank ? `${nextRank.min - xp} XP` : "도달"}</h3>
            <div className="mini-stats">
              {Object.entries(stats).map(([label, value]) => <span key={label}>{label} <b>{value}</b></span>)}
            </div>
            <div className="live-score"><span>CASE SCORE</span><b>{score}<small>/100</small></b></div>
          </aside>
        </section>
      ) : (
        <section className="result-board" aria-live="polite">
          <div className="result-score">
            <p className="section-label">ENGAGEMENT COMPLETE</p>
            <strong>{score}</strong><span>/ 100</span>
            <h2>{score >= 80 ? "보고서와 정확히 맞췄습니다." : score >= 60 ? "의견은 맞았고, 절차는 더 날카롭게." : "중요한 단서를 놓쳤습니다."}</h2>
            <p>이번 사건에서 <b>+{earnedXp} XP</b>를 획득했습니다.</p>
            <button className="primary result-button" onClick={restart}>다시 감사하기 <span>↻</span></button>
          </div>
          <div className="report-match">
            <div className="match-head"><span>ACTUAL REPORT · 2024.03.05</span><b>MATCH SHEET</b></div>
            <h3>실제 감사보고서와 대조</h3>
            <ul>
              <li><span>감사의견</span><b>적정의견</b><i>✓</i></li>
              <li><span>핵심감사사항</span><b>SI 서비스 진행률 계산의 적정성</b><i>✓</i></li>
              <li><span>계속기업 중요 불확실성</span><b>해당 없음</b><i>✓</i></li>
              <li><span>연결 내부회계관리제도</span><b>적정의견</b><i>✓</i></li>
              <li><span>기타사항</span><b>전기 재무제표는 타 감사인 감사</b><i>✓</i></li>
            </ul>
            <p className="report-note">핵심감사사항은 별도 의견이 아니라, 당기 감사에서 가장 유의적이었던 사항을 설명합니다.</p>
            <button className="text-button" onClick={() => setSourcesOpen(true)}>공시 원문과 근거 보기 ↗</button>
          </div>
        </section>
      )}

      <section className="career-strip">
        <p className="section-label">CAREER LADDER</p>
        <div className="career-list">
          {ranks.map((item, index) => (
            <div key={item.title} className={xp >= item.min ? "passed" : ""}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{item.title}</b>
              <small>{item.year} · {item.min.toLocaleString()} XP</small>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span>PUBLIC DISCLOSURE SIMULATION · SAMPLE MODE</span>
        <span>교육용 시뮬레이션이며 실제 감사판단을 대체하지 않습니다.</span>
        <button onClick={() => setSourcesOpen(true)}>출처와 방법론</button>
      </footer>

      {sourcesOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSourcesOpen(false)}>
          <section className="source-modal" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSourcesOpen(false)} aria-label="닫기">×</button>
            <p className="section-label">SOURCE NOTES</p>
            <h2 id="source-title">실제 공시를 게임 문항으로 바꿨습니다.</h2>
            <p>수치와 결론은 공개된 2023년 연결재무제표·감사보고서에서 가져왔고, 선택지는 감사기준서의 위험평가–대응–보고 흐름에 맞춰 교육용으로 재구성했습니다.</p>
            <div className="source-links">
              <a href="https://image.samsungsds.com/en/investor/financial_info/report/__icsFiles/afieldfile/2024/05/16/Samsung%20SDS_FY23_Audit%20report_signed.pdf" target="_blank" rel="noreferrer"><span>01</span><b>2023 연결감사보고서</b><small>삼성SDS 공식 IR ↗</small></a>
              <a href="https://kind.krx.co.kr/external/2024/03/12/001390/20240312003502/11011.htm" target="_blank" rel="noreferrer"><span>02</span><b>2023 사업보고서</b><small>DART 연계 공시 ↗</small></a>
              <a href="https://www.samsungsds.com/kr/investor/board/1276104_4302.html" target="_blank" rel="noreferrer"><span>03</span><b>외부감사인 선임 공고</b><small>삼일회계법인 · 2023–2025 ↗</small></a>
            </div>
            <div className="api-note"><b>DART API 연결 준비</b><p>다음 단계에서는 API 키를 서버 비밀값으로만 저장하고, 브라우저·코드·로그에는 노출하지 않습니다.</p></div>
          </section>
        </div>
      )}
    </main>
  );
}
