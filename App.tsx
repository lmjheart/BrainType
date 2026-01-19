
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { BrainType, Step, DiagnosticResult } from './types';
import { QUESTIONS, BRAIN_TYPE_DETAILS } from './constants';
import Button from './components/Button';
import Progress from './components/Progress';
import DeclarationCard from './components/DeclarationCard';
import { 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  RefreshCw, 
  BrainCircuit, 
  BarChart3, 
  Edit3, 
  Sparkles,
  Target,
  Users,
  EyeOff
} from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('SPLASH');
  const [userName, setUserName] = useState('');
  const [customCommitment, setCustomCommitment] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<(BrainType | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticResult | null>(null);
  const [showCard, setShowCard] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const resultTopRef = useRef<HTMLDivElement>(null);

  const calculateResult = () => {
    const counts = answers.reduce((acc, type) => {
      if (type) acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {
      [BrainType.CHEETAH]: 0,
      [BrainType.OWL]: 0,
      [BrainType.DOLPHIN]: 0,
      [BrainType.ELEPHANT]: 0
    } as Record<BrainType, number>);

    const sortedTypes = (Object.keys(counts) as BrainType[]).sort((a, b) => counts[b] - counts[a]);
    
    setDiagnosticData({
      primary: BRAIN_TYPE_DETAILS[sortedTypes[0]],
      secondary: BRAIN_TYPE_DETAILS[sortedTypes[1]],
      scores: counts
    });

    setStep('LOADING');
    setTimeout(() => {
      setStep('RESULT');
      window.scrollTo(0, 0);
    }, 2500);
  };

  const handleSelectOption = (type: BrainType) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIdx] = type;
    setAnswers(newAnswers);
    
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestionIdx(prev => prev + 1), 300);
    }
  };

  const goNext = () => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else if (answers[currentQuestionIdx]) {
      calculateResult();
    }
  };

  const goBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const saveAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${userName}_Limitless_Brain_Declaration.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      alert('이미지 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
    }
  };

  const resetTest = () => {
    setStep('SPLASH');
    setUserName('');
    setCustomCommitment('');
    setCurrentQuestionIdx(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setDiagnosticData(null);
    setShowCard(false);
  };

  const handleFinalCommitment = () => {
    if (!customCommitment.trim() || customCommitment.length < 5) {
      alert('당신을 변화시킬 실천 다짐을 5자 이상 입력해주세요!');
      return;
    }
    setShowCard(true);
    setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-2xl relative overflow-x-hidden font-['Pretendard']">
      <AnimatePresence mode="wait">
        {step === 'SPLASH' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-screen">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-24 h-24 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-indigo-200">
              <BrainCircuit size={52} />
            </motion.div>
            <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight tracking-tight">마지막 몰입<br/><span className="text-indigo-600">뇌 유형 진단</span></h1>
            <p className="text-gray-500 mb-12 font-medium leading-relaxed">짐 퀵의 C.O.D.E 시스템을 통해<br/>당신의 잠재된 뇌 엔진을 발견하세요.</p>
            <Button size="lg" fullWidth onClick={() => setStep('NAME_INPUT')} className="h-16 text-xl">진단 시작하기 <ChevronRight className="ml-2" size={24} /></Button>
          </motion.div>
        )}

        {step === 'NAME_INPUT' && (
          <motion.div key="name_input" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="flex-1 flex flex-col justify-center p-8 min-h-screen">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-gray-800 mb-3">반갑습니다!</h2>
              <p className="text-gray-500 font-medium leading-relaxed text-lg">진단 결과지에 표시될<br/><span className="text-indigo-600 font-bold">당신의 이름</span>을 입력해주세요.</p>
            </div>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} 
              placeholder="예: 홍길동" 
              className="w-full px-7 py-5 rounded-[1.5rem] border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none text-2xl transition-all mb-12 font-bold bg-gray-50" 
              autoFocus 
              onKeyPress={(e) => e.key === 'Enter' && userName.trim() && setStep('QUIZ')} 
            />
            <Button size="lg" fullWidth disabled={!userName.trim()} onClick={() => setStep('QUIZ')} className="h-16">진단 진행하기</Button>
          </motion.div>
        )}

        {step === 'QUIZ' && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-6 min-h-screen">
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-black text-indigo-600 tracking-widest uppercase">Question {currentQuestionIdx + 1}</span>
                <span className="text-xs text-gray-400 font-black">{currentQuestionIdx + 1} / {QUESTIONS.length}</span>
              </div>
              <Progress current={currentQuestionIdx + 1} total={QUESTIONS.length} />
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIdx} 
                  initial={{ x: 40, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  exit={{ x: -40, opacity: 0 }} 
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h3 className="text-2xl font-black text-gray-800 mb-12 leading-tight break-keep">{QUESTIONS[currentQuestionIdx].text}</h3>
                  <div className="space-y-4">
                    {QUESTIONS[currentQuestionIdx].options.map((option, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleSelectOption(option.type)} 
                        className={`w-full p-6 text-left rounded-[1.8rem] border-2 transition-all flex items-center gap-5 group relative overflow-hidden ${
                          answers[currentQuestionIdx] === option.type 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' 
                            : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-colors ${
                          answers[currentQuestionIdx] === option.type 
                            ? 'bg-white/20 text-white' 
                            : 'bg-indigo-50 text-indigo-500 border border-indigo-100'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={`font-bold leading-snug flex-1 ${answers[currentQuestionIdx] === option.type ? 'text-white' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                        {answers[currentQuestionIdx] === option.type && (
                          <motion.div layoutId="check" className="absolute right-6"><Sparkles size={20} /></motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex gap-4">
              <Button variant="secondary" onClick={goBack} disabled={currentQuestionIdx === 0} className="flex-1 h-14 rounded-2xl">
                <ChevronLeft size={22} className="mr-1"/> 이전
              </Button>
              <Button variant="primary" onClick={goNext} disabled={!answers[currentQuestionIdx]} className="flex-[2] h-14 rounded-2xl">
                {currentQuestionIdx === QUESTIONS.length - 1 ? '분석 결과 보기' : '다음 단계'} <ChevronRight size={22} className="ml-1"/>
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'LOADING' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-screen">
            <div className="relative mb-12">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                className="w-32 h-32 border-[12px] border-indigo-50 border-t-indigo-600 rounded-full" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit size={48} className="text-indigo-600" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">지능 시스템 분석 중...</h2>
            <p className="text-gray-500 font-medium leading-relaxed italic">
              "당신의 뇌는 고정된 하드웨어가 아닙니다.<br/>매일 업그레이드할 수 있는 소프트웨어입니다."
            </p>
          </motion.div>
        )}

        {step === 'RESULT' && diagnosticData && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col bg-gray-50/30">
            <div ref={resultTopRef} className="p-10 pt-20 text-center text-white relative overflow-hidden" style={{ backgroundColor: diagnosticData.primary.color }}>
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 animate={{ opacity: 1, y: 0 }}
                 className="relative z-10"
               >
                <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-4 border border-white/30">
                  Primary Brain Profile
                </div>
                <h2 className="text-6xl font-black mb-6 drop-shadow-2xl">{diagnosticData.primary.name}</h2>
                <div className="max-w-[280px] mx-auto bg-black/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                  <p className="text-[15px] font-bold leading-relaxed">{diagnosticData.primary.description}</p>
                </div>
               </motion.div>
            </div>

            <div className="px-6 -mt-10 relative z-20 pb-20">
              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><BarChart3 size={24} className="text-indigo-600" /> C.O.D.E 밸런스</h3>
                  <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Total 20 Points</div>
                </div>
                <div className="space-y-6">
                  {(Object.entries(diagnosticData.scores) as [BrainType, number][]).map(([type, score]) => (
                    <div key={type} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end px-1">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{BRAIN_TYPE_DETAILS[type].englishName}</span>
                        <span className="text-sm font-black" style={{ color: BRAIN_TYPE_DETAILS[type].color }}>{score} <span className="text-[10px] text-gray-300">/ 20</span></span>
                      </div>
                      <div className="h-3.5 bg-gray-50 rounded-full p-0.5 border border-gray-100 shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${(score / 20) * 100}%` }} 
                          transition={{ duration: 1.2, ease: "circOut" }} 
                          className="h-full rounded-full shadow-lg" 
                          style={{ backgroundColor: BRAIN_TYPE_DETAILS[type].color }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-10">
                <motion.div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-pink-50 text-pink-500 rounded-xl"><Users size={20} /></div>
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">최고의 파트너 상성</h4>
                  </div>
                  <p className="text-[13px] font-bold text-gray-600 leading-snug mb-2">
                    <span className="text-pink-600">[{diagnosticData.primary.chemistry.partner}]</span>와 함께할 때 시너지가 납니다.
                  </p>
                </motion.div>

                <motion.div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-50 text-amber-500 rounded-xl"><EyeOff size={20} /></div>
                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">나의 사각지대</h4>
                  </div>
                  <p className="text-[13px] font-bold text-gray-600 leading-snug break-keep">
                    {diagnosticData.primary.blindSpot}
                  </p>
                </motion.div>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 mb-12 border border-gray-100">
                <div className="mb-10 text-center">
                  <h3 className="text-2xl font-black text-gray-800 mb-2">브레인 마스터 전략</h3>
                </div>
                <div className="space-y-12">
                  <GuideSection icon={<Target size={22}/>} title="읽는 순간 똑똑해지는 독서법" list={diagnosticData.primary.readingStrategy} color="orange" />
                  <GuideSection icon={<RefreshCw size={22}/>} title="더 많은 것을 외우는 기억 훈련" list={diagnosticData.primary.memoryStrategy} color="blue" />
                </div>
              </div>

              <motion.div className="bg-indigo-600 rounded-[3rem] p-9 mb-16 text-white text-center shadow-2xl relative">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-xl"><Edit3 size={32} /></div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">당신을 깨우는 한 마디,<br/>실천 다짐</h3>
                
                <textarea 
                  value={customCommitment} 
                  onChange={(e) => setCustomCommitment(e.target.value)} 
                  placeholder="예: 매일 아침 일어나자마자 그날의 핵심 목표 3가지를 시각화하겠다!" 
                  className="w-full h-32 px-6 py-5 rounded-[1.8rem] border-2 border-transparent focus:border-white/50 outline-none text-[16px] transition-all mb-8 font-bold resize-none shadow-inner bg-indigo-700 placeholder-indigo-400" 
                />
                
                <Button size="lg" fullWidth onClick={handleFinalCommitment} className="relative bg-white text-indigo-600 hover:bg-yellow-50 h-18 text-2xl font-black shadow-2xl py-6">
                  선언서 카드 발급 <Sparkles size={24} className="ml-2" />
                </Button>
              </motion.div>

              <AnimatePresence>
                {showCard && (
                  <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-16">
                    <DeclarationCard userName={userName} typeInfo={diagnosticData.primary} customCommitment={customCommitment} cardRef={cardRef} />
                    <div className="w-full mt-12 px-4">
                      <Button variant="primary" fullWidth size="lg" onClick={saveAsImage} className="h-20 text-xl shadow-2xl"><Download size={24} className="mr-2" /> 선언서 이미지 저장하기</Button>
                      <p className="text-center text-gray-400 text-xs mt-4 font-bold">이미지를 저장하여 당신의 다짐을 간직하세요.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center pt-8 border-t border-gray-100">
                <button onClick={resetTest} className="text-gray-300 font-black flex items-center justify-center mx-auto text-sm hover:text-indigo-600 py-4">
                  <RefreshCw size={16} className="mr-2" /> 테스트 다시 하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GuideSection = ({ icon, title, list, color }: any) => {
  const colorMap: any = { 
    orange: 'bg-orange-50 text-orange-600 border-orange-100', 
    blue: 'bg-blue-50 text-blue-600 border-blue-100'
  };
  return (
    <div className="group">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center border-2 ${colorMap[color]}`}>{icon}</div>
        <h4 className="font-black text-gray-800 text-[16px] leading-tight break-keep">{title}</h4>
      </div>
      <ul className="space-y-5 ml-2">
        {list.map((s: string, i: number) => (
          <li key={i} className="flex gap-4">
            <span className={`w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0 ${colorMap[color].split(' ')[1]}`} />
            <span className="text-[14px] text-gray-600 font-bold leading-relaxed break-keep">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
