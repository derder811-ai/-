import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  BookOpen, 
  MapPin, 
  Trophy, 
  CheckCircle2, 
  Heart,
  ChevronRight,
  Award,
  Eye,
  Footprints,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  PlusCircle,
  ShoppingBag,
  LayoutGrid,
  TrendingUp,
  X,
  Gift,
  Star,
  User,
  School,
  ShieldCheck,
  ArrowLeft,
  Info,
  Globe,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Constants ---

type Role = 'k12' | 'university';
type Tab = 'home' | 'ranking' | 'mall';

interface Task {
  id: string;
  title: string;
  points: number;
  category: string;
  icon: React.ReactNode;
  pathStep: 'perceive' | 'experience' | 'act' | 'co-build';
}

interface MallItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ROLE_CONFIG_STATIC: Record<Role, any> = {
  k12: {
    label: '中小学生',
    subLabel: '苔花小观察员',
    description: '看见真实，打破偏见。从小小观察员开始，让校园更温暖。',
    tasks: []
  },
  university: {
    label: '大学生',
    subLabel: '苔花合伙人',
    description: '专业赋能，系统改变。作为合伙人，深度参与校园融合生态建设。',
    tasks: []
  }
};

const SCHOOLS = [
  '苔花第一小学', '苔花实验中学', '苔花大学', '九龙塘实验小学', '香港融合中学', '九龙文理学院'
];

type Language = 'zh-CN' | 'zh-HK' | 'en';

const TRANSLATIONS: Record<Language, any> = {
  'zh-CN': {
    appName: '苔花公约',
    mossCovenant: 'Moss Covenant',
    home: '行动',
    ranking: '排行',
    mall: '商城',
    feedback: '用户反馈',
    k12: '中小学生',
    university: '大学生',
    points: '积分',
    myPoints: '我的积分',
    growthPath: '成长路径',
    todayTask: '今日推荐行动',
    activityReg: '系列活动报名',
    kowloonActivity: '九龙地区系列活动报名',
    universityActivity: '大学生系列活动报名',
    activityDesc: '深度参与，共同创造无障碍校园。',
    apply: '立即报名',
    welcome: '看见真实，打破偏见。从小小观察员开始，让校园更温暖。',
    welcomeUni: '专业赋能，系统改变。作为合伙人，深度参与校园融合生态建设。',
    motto: '苔花如米小，也学牡丹开。',
    currentLevel: '当前等级',
    juniorObserver: '苔花初级观察员',
    step1: '感知', step2: '体验', step3: '行动', step4: '共建',
    oneStep: '一步一包容',
    reset: '重置应用状态',
    feedbackTitle: '用户反馈',
    feedbackDesc: '您的建议是苔花绽放的养分。请告诉我们您的想法或遇到的问题。',
    submit: '提交反馈',
    successTitle: '行动完成！',
    successDesc: '感谢你的包容行动，苔花因你而绽放。',
    continue: '继续行动',
    rankTitle: '积分排行榜',
    rankDesc: '与全校伙伴一起，见证包容的力量。',
    mallTitle: '积分商城',
    mallDesc: '用行动兑换荣誉与心意。',
    exchange: '兑换',
    category: '分类',
    price: '价格',
    k12Label: '中小学生',
    uniLabel: '大学生',
    k12Sub: '苔花小观察员',
    uniSub: '苔花合伙人',
    loginWelcome: '欢迎加入苔花公约',
    loginUserDesc: '请先设置您的用户名，开启公益之旅。',
    placeholderUser: '请输入用户名',
    next: '下一步',
    back: '返回',
    selectSchool: '选择您的学校',
    schoolDesc: '我们将为您匹配专属的校园公益任务。',
    realNameAuth: '实名认证',
    authDesc: '为了保障公益行动的真实性，请完成认证。',
    placeholderName: '真实姓名',
    placeholderId: '身份证号（仅用于核验）',
    completeAuth: '完成认证并进入',
    onboard1Title: '看见真实',
    onboard1Desc: '在这里，我们通过观察与体验，发现校园中被忽视的障碍。',
    onboard2Title: '采取行动',
    onboard2Desc: '每一个微小的改变，都是通往包容校园的一大步。',
    onboard3Title: '共建未来',
    onboard3Desc: '与全校伙伴一起，打造一个没有障碍、充满尊重的苔花世界。',
    startJourney: '开启旅程',
    placeholderFeedback: '在这里输入您的反馈...',
    thanksFeedback: '感谢您的反馈！',
    earnedPoints: '获得积分',
    task1: '蒙眼行走体验',
    task2: '寻找盲道障碍',
    task3: '学习手语儿歌',
    task4: '提交无障碍建议',
    task5: '校园无障碍专业审计',
    task6: '融合文化节策划',
    task7: '障碍同学学业支持',
    task8: '志愿服务时长认证'
  },
  'zh-HK': {
    appName: '苔花公約',
    mossCovenant: 'Moss Covenant',
    home: '行動',
    ranking: '排行',
    mall: '商城',
    feedback: '用戶回饋',
    k12: '中小學生',
    university: '大學生',
    points: '積分',
    myPoints: '我的積分',
    growthPath: '成長路徑',
    todayTask: '今日推薦行動',
    activityReg: '系列活動報名',
    kowloonActivity: '九龍地區系列活動報名',
    universityActivity: '大學生系列活動報名',
    activityDesc: '深度參與，共同創造無障礙校園。',
    apply: '立即報名',
    welcome: '看見真實，打破偏見。从小小觀察員開始，讓校園更溫暖。',
    welcomeUni: '專業賦能，系統改變。作為合伙人，深度參與校園融合生態建設。',
    motto: '苔花如米小，也學牡丹開。',
    currentLevel: '當前等級',
    juniorObserver: '苔花初級觀察員',
    step1: '感知', step2: '體驗', step3: '行動', step4: '共建',
    oneStep: '一步一包容',
    reset: '重置應用狀態',
    feedbackTitle: '用戶回饋',
    feedbackDesc: '您的建議是苔花綻放的養分。請告訴我們您的想法或遇到的問題。',
    submit: '提交回饋',
    successTitle: '行動完成！',
    successDesc: '感謝你的包容行動，苔花因你而綻放。',
    continue: '繼續行動',
    rankTitle: '積分排行榜',
    rankDesc: '與全校伙伴一起，見證包容的力量。',
    mallTitle: '積分商城',
    mallDesc: '用行動兌換榮譽與心意。',
    exchange: '兌換',
    category: '分類',
    price: '價格',
    k12Label: '中小學生',
    uniLabel: '大學生',
    k12Sub: '苔花小觀察員',
    uniSub: '苔花合伙人',
    loginWelcome: '歡迎加入苔花公約',
    loginUserDesc: '請先設置您的用戶名，開啟公益之旅。',
    placeholderUser: '請輸入用戶名',
    next: '下一步',
    back: '返回',
    selectSchool: '選擇您的學校',
    schoolDesc: '我們將为您匹配專屬的校園公益任務。',
    realNameAuth: '實名認證',
    authDesc: '為了保障公益行動的真實性，請完成認證。',
    placeholderName: '真實姓名',
    placeholderId: '身份證號（僅用於核驗）',
    completeAuth: '完成認證並進入',
    onboard1Title: '看見真實',
    onboard1Desc: '在這裡，我們通過觀察與體驗，發現校園中被忽視的障礙。',
    onboard2Title: '採取行動',
    onboard2Desc: '每一個微小的改變，都是通往包容校園的一大步。',
    onboard3Title: '共建未來',
    onboard3Desc: '與全校伙伴一起，打造一個沒有障礙、充滿尊重的苔花世界。',
    startJourney: '開啟旅程',
    placeholderFeedback: '在這裡輸入您的回饋...',
    thanksFeedback: '感謝您的回饋！',
    earnedPoints: '獲得積分',
    task1: '蒙眼行走體驗',
    task2: '尋找盲道障礙',
    task3: '學習手語兒歌',
    task4: '提交無障礙建議',
    task5: '校園無障礙專業審核',
    task6: '融合文化節策劃',
    task7: '障礙同學學業支持',
    task8: '志願服務時長認證'
  },
  'en': {
    appName: 'Moss Covenant',
    mossCovenant: 'Moss Covenant',
    home: 'Action',
    ranking: 'Ranking',
    mall: 'Mall',
    feedback: 'Feedback',
    k12: 'K-12',
    university: 'University',
    points: 'Points',
    myPoints: 'My Points',
    growthPath: 'Growth Path',
    todayTask: 'Today\'s Tasks',
    activityReg: 'Activity Registration',
    kowloonActivity: 'Kowloon Region Series Activities',
    universityActivity: 'University Series Activities',
    activityDesc: 'Deeply participate and co-create an accessible campus.',
    apply: 'Apply Now',
    welcome: 'See the truth, break prejudice. Start as a small observer and make the campus warmer.',
    welcomeUni: 'Professional empowerment, systemic change. As a partner, deeply participate in campus integration.',
    motto: 'Moss flowers are as small as rice, yet they learn to bloom like peonies.',
    currentLevel: 'Current Level',
    juniorObserver: 'Junior Observer',
    step1: 'Perceive', step2: 'Experience', step3: 'Act', step4: 'Co-build',
    oneStep: 'One Step, One Inclusion',
    reset: 'Reset App State',
    feedbackTitle: 'Feedback',
    feedbackDesc: 'Your suggestions are the nutrients for Moss to bloom. Please tell us your thoughts.',
    submit: 'Submit',
    successTitle: 'Action Completed!',
    successDesc: 'Thank you for your inclusive action. Moss blooms because of you.',
    continue: 'Continue',
    rankTitle: 'Leaderboard',
    rankDesc: 'Join partners across the school to witness the power of inclusion.',
    mallTitle: 'Points Mall',
    mallDesc: 'Exchange your actions for honor and gifts.',
    exchange: 'Exchange',
    category: 'Category',
    price: 'Price',
    k12Label: 'K-12',
    uniLabel: 'University',
    k12Sub: 'Junior Observer',
    uniSub: 'Moss Partner',
    loginWelcome: 'Welcome to Moss Covenant',
    loginUserDesc: 'Please set your username to start your journey.',
    placeholderUser: 'Enter username',
    next: 'Next',
    back: 'Back',
    selectSchool: 'Select Your School',
    schoolDesc: 'We will match you with exclusive campus tasks.',
    realNameAuth: 'Real-name Auth',
    authDesc: 'To ensure the truth of actions, please complete auth.',
    placeholderName: 'Real Name',
    placeholderId: 'ID Number (for verification only)',
    completeAuth: 'Complete and Enter',
    onboard1Title: 'See the Truth',
    onboard1Desc: 'Here, we discover ignored obstacles through observation.',
    onboard2Title: 'Take Action',
    onboard2Desc: 'Every small change is a big step towards an inclusive campus.',
    onboard3Title: 'Build the Future',
    onboard3Desc: 'Build a world without obstacles and full of respect together.',
    startJourney: 'Start Journey',
    placeholderFeedback: 'Enter your feedback here...',
    thanksFeedback: 'Thanks for your feedback!',
    earnedPoints: 'Earned Points',
    task1: 'Blindfolded Walk Experience',
    task2: 'Find Tactile Paving Obstacles',
    task3: 'Learn Sign Language Songs',
    task4: 'Submit Accessibility Suggestion',
    task5: 'Campus Accessibility Audit',
    task6: 'Inclusion Festival Planning',
    task7: 'Academic Support for Peers',
    task8: 'Volunteer Service Certification'
  }
};

// --- Components ---

const MossLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="currentColor" strokeWidth="8" strokeLinecap="round">
      <path d="M50 50 C 50 20, 80 20, 50 50 Z" transform="rotate(0 50 50)" />
      <path d="M50 50 C 50 20, 80 20, 50 50 Z" transform="rotate(60 50 50)" />
      <path d="M50 50 C 50 20, 80 20, 50 50 Z" transform="rotate(120 50 50)" />
      <path d="M50 50 C 50 20, 80 20, 50 50 Z" transform="rotate(180 50 50)" />
      <path d="M50 50 C 50 20, 80 20, 50 50 Z" transform="rotate(240 50 50)" />
      <path d="M50 50 C 50 20, 80 20, 50 50 Z" transform="rotate(300 50 50)" />
    </g>
  </svg>
);

const LoginFlow = ({ onComplete, t }: { onComplete: (data: any) => void, t: any }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    school: '',
    realName: '',
    idNumber: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-xl border border-stone-100"
      >
        <div className="flex justify-center mb-8">
          <MossLogo className="w-16 h-16 text-emerald-600" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{t.loginWelcome || '欢迎加入苔花公约'}</h2>
              <p className="text-stone-400 text-sm mb-8">{t.loginUserDesc || '请先设置您的用户名，开启公益之旅。'}</p>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                  <input 
                    type="text"
                    placeholder={t.placeholderUser || '请输入用户名'}
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!formData.username}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-stone-800 disabled:opacity-50 shadow-lg shadow-stone-200"
                >
                  {t.next || '下一步'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button onClick={prevStep} className="mb-6 flex items-center gap-2 text-stone-400 text-sm hover:text-stone-600">
                <ArrowLeft className="w-4 h-4" /> {t.back || '返回'}
              </button>
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{t.selectSchool || '选择您的学校'}</h2>
              <p className="text-stone-400 text-sm mb-8">{t.schoolDesc || '我们将为您匹配专属的校园公益任务。'}</p>
              <div className="space-y-3 mb-8">
                {SCHOOLS.map(school => (
                  <button
                    key={school}
                    onClick={() => setFormData({...formData, school})}
                    className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${
                      formData.school === school 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-stone-100 bg-stone-50 text-stone-600 hover:border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <School className="w-4 h-4" />
                      {school}
                    </div>
                    {formData.school === school && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.school}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-stone-800 disabled:opacity-50 shadow-lg shadow-stone-200"
              >
                {t.next || '下一步'}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button onClick={prevStep} className="mb-6 flex items-center gap-2 text-stone-400 text-sm hover:text-stone-600">
                <ArrowLeft className="w-4 h-4" /> {t.back || '返回'}
              </button>
              <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{t.realNameAuth || '实名认证'}</h2>
              <p className="text-stone-400 text-sm mb-8">{t.authDesc || '为了保障公益行动的真实性，请完成认证。'}</p>
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                  <input 
                    type="text"
                    placeholder={t.placeholderName || '真实姓名'}
                    value={formData.realName}
                    onChange={e => setFormData({...formData, realName: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300" />
                  <input 
                    type="text"
                    placeholder={t.placeholderId || '身份证号（仅用于核验）'}
                    value={formData.idNumber}
                    onChange={e => setFormData({...formData, idNumber: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <button 
                onClick={() => onComplete(formData)}
                disabled={!formData.realName || !formData.idNumber}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold transition-all hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-200"
              >
                {t.completeAuth || '完成认证并进入'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const Onboarding = ({ onComplete, t }: { onComplete: () => void, t: any }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: t.onboard1Title || "看见真实",
      desc: t.onboard1Desc || "在这里，我们通过观察与体验，发现校园中被忽视的障碍。",
      icon: <Eye className="w-12 h-12 text-emerald-600" />
    },
    {
      title: t.onboard2Title || "采取行动",
      desc: t.onboard2Desc || "每一个微小的改变，都是通往包容校园的一大步。",
      icon: <Footprints className="w-12 h-12 text-emerald-600" />
    },
    {
      title: t.onboard3Title || "共建未来",
      desc: t.onboard3Desc || "与全校伙伴一起，打造一个没有障碍、充满尊重的苔花世界。",
      icon: <Sparkles className="w-12 h-12 text-emerald-600" />
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="text-center max-w-sm"
        >
          <div className="mb-10 flex justify-center">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
              {steps[step].icon}
            </div>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4">{steps[step].title}</h2>
          <p className="text-stone-400 text-base leading-relaxed mb-12">{steps[step].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-emerald-600' : 'w-2 bg-stone-100'}`} />
        ))}
      </div>

      <button 
        onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onComplete()}
        className="w-full max-w-xs bg-stone-900 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-2 group shadow-xl shadow-stone-200"
      >
        {step < steps.length - 1 ? t.continue || "继续" : t.startJourney || "开启旅程"}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

const FeedbackModal = ({ onClose, t }: { onClose: () => void, t: any }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-6"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-stone-800">{t.feedbackTitle}</h2>
        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-stone-400" />
        </button>
      </div>
      <p className="text-stone-500 text-sm mb-6">
        {t.feedbackDesc}
      </p>
      <textarea 
        className="w-full h-32 bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-6 resize-none"
        placeholder={t.placeholderFeedback || "在这里输入您的反馈..."}
      />
      <button 
        onClick={() => {
          alert(t.thanksFeedback || '感谢您的反馈！');
          onClose();
        }}
        className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-stone-800 shadow-lg shadow-stone-200"
      >
        {t.submit}
      </button>
    </motion.div>
  </motion.div>
);

const SuccessModal = ({ points, onClose, t }: { points: number, onClose: () => void, t: any }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-6"
  >
    <motion.div 
      initial={{ scale: 0.8, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <Trophy className="w-10 h-10" />
          </motion.div>
        </div>
      </div>
      <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{t.successTitle}</h2>
      <p className="text-stone-500 text-sm mb-6 leading-relaxed">
        {t.successDesc}
      </p>
      <div className="bg-emerald-50 py-4 rounded-2xl mb-8">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">{t.earnedPoints || '获得积分'}</span>
        <span className="text-3xl font-serif font-bold text-emerald-600">+{points}</span>
      </div>
      <button 
        onClick={onClose}
        className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold transition-all hover:bg-stone-800 shadow-lg shadow-stone-200"
      >
        {t.continue}
      </button>
    </motion.div>
  </motion.div>
);

const RankingList = ({ role, data, t }: { role: Role, data: any[], t: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white mb-8 relative overflow-hidden shadow-xl shadow-emerald-100">
      <div className="relative z-10">
        <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">
          {role === 'k12' ? t.k12Sub : t.uniSub}
        </h3>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-serif font-bold">12</span>
          <span className="text-sm font-medium mb-2 opacity-80">/ 2500+ {t.home === 'Action' ? 'Partners' : '伙伴'}</span>
        </div>
      </div>
      <TrendingUp className="absolute right-8 bottom-8 w-24 h-24 opacity-10" />
    </div>
    
    <div className="space-y-3">
      {data.map((user, idx) => (
        <div key={user.id} className={`bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${user.isMe ? 'border-emerald-200 bg-emerald-50/30' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
            idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
            idx === 1 ? 'bg-stone-100 text-stone-600' :
            idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-stone-400'
          }`}>
            {idx + 1}
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400">
            {user.avatar}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              {user.name}
              {user.isMe && <span className="text-[8px] bg-emerald-600 text-white px-1 py-0.5 rounded-full uppercase tracking-widest">Me</span>}
            </h4>
            <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">
              {user.school}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-serif font-bold text-emerald-600">{user.points}</span>
            <p className="text-[10px] text-stone-400 font-medium">{t.points}</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const PointsMall = ({ role, currentPoints, onExchange, items, t, mallImages, isGenerating }: { role: Role, currentPoints: number, onExchange: (item: any) => void, items: any[], t: any, mallImages: Record<number, string>, isGenerating: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-2 gap-4"
  >
    {items.map((item) => (
      <div key={item.id} className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
        <div className="aspect-[4/3] relative overflow-hidden flex items-center justify-center bg-stone-50">
          {mallImages[item.id] ? (
            <img src={mallImages[item.id]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              {isGenerating ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-emerald-400" />
                </motion.div>
              ) : (
                <div className="group-hover:scale-110 transition-transform duration-700">
                  {item.icon}
                </div>
              )}
              {isGenerating && <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest animate-pulse">Generating...</span>}
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-lg text-stone-600">
              {item.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-xs font-bold text-stone-800 mb-1 line-clamp-1">{item.name}</h4>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
              <span className="text-sm font-serif font-bold text-emerald-600">{item.price}</span>
            </div>
            <button 
              onClick={() => onExchange(item)}
              disabled={currentPoints < item.price}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                currentPoints >= item.price 
                ? 'bg-stone-900 text-white hover:bg-stone-800' 
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              {t.exchange}
            </button>
          </div>
        </div>
      </div>
    ))}
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>('k12');
  const [points, setPoints] = useState(1250);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeStep, setActiveStep] = useState('perceive');
  const [showSuccess, setShowSuccess] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lang, setLang] = useState<Language>('zh-CN');
  const [mallImages, setMallImages] = useState<Record<Role, Record<number, string>>>({ k12: {}, university: {} });
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const t = TRANSLATIONS[lang];

  // Generate Moss Covenant specific images for the mall
  useEffect(() => {
    if (activeTab === 'mall' && Object.keys(mallImages[role]).length === 0 && !isGeneratingImages) {
      const generateMallImages = async () => {
        setIsGeneratingImages(true);
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        
        const k12Prompts: Record<number, string> = {
          1: "A high-quality product photo of a set of circular stickers for the 'Moss Covenant' charity project. The stickers feature small green moss flowers and the motto 'Moss flowers are as small as rice, yet they learn to bloom like peonies'. Aesthetic is minimalist, eco-friendly, emerald green and white colors.",
          2: "A high-quality product photo of a premium emerald green notebook with a minimalist embossed 'Moss Covenant' logo. The logo is a stylized small flower. Soft lighting, clean background.",
          3: "A high-quality photo of a circular metal enamel badge for 'Moss Observer'. It features a vibrant green moss flower design. The badge is pinned to a white canvas fabric.",
          4: "A beautiful digital certificate design for 'Moss Partner'. Elegant typography, emerald green borders, a watermark of moss flowers, professional and inspiring."
        };

        const uniPrompts: Record<number, string> = {
          1: "A professional digital certificate for 'Moss Partner' (University level). Modern typography, emerald green accents, official seal, high-quality design.",
          2: "A professional 'Accessibility Audit Kit' including a high-quality measuring tape, a clipboard with audit forms, and a professional level tool. Minimalist, organized, emerald green branding.",
          3: "A high-quality 3D render of a minimalist exhibition booth at a 'Campus Inclusion Festival'. Emerald green and white theme, clean lines, professional display boards.",
          4: "A professional business-style graphic representing a 'Career Internship Recommendation'. Features a sleek envelope with a 'Moss Covenant' wax seal and a modern office background."
        };

        const prompts = role === 'k12' ? k12Prompts : uniPrompts;
        const newImages: Record<number, string> = {};
        
        try {
          for (const [id, prompt] of Object.entries(prompts)) {
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts: [{ text: prompt }] },
              config: {
                imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
              }
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
              if (part.inlineData) {
                newImages[Number(id)] = `data:image/png;base64,${part.inlineData.data}`;
                break;
              }
            }
          }
          setMallImages(prev => ({
            ...prev,
            [role]: newImages
          }));
        } catch (error) {
          console.error("Error generating mall images:", error);
        } finally {
          setIsGeneratingImages(false);
        }
      };

      generateMallImages();
    }
  }, [activeTab, mallImages, isGeneratingImages, role]);

  const DYNAMIC_PATH_STEPS = [
    { id: 'perceive', label: t.step1, color: 'bg-emerald-100 text-emerald-700' },
    { id: 'experience', label: t.step2, color: 'bg-blue-100 text-blue-700' },
    { id: 'act', label: t.step3, color: 'bg-orange-100 text-orange-700' },
    { id: 'co-build', label: t.step4, color: 'bg-purple-100 text-purple-700' },
  ];

  const ROLE_CONFIG: Record<Role, any> = {
    k12: {
      label: t.k12Label,
      subLabel: t.k12Sub,
      description: t.welcome,
      tasks: [
        { id: 'k1', title: t.task1, points: 50, category: '体验', icon: <Eye className="w-4 h-4" />, pathStep: 'experience' },
        { id: 'k2', title: t.task2, points: 100, category: '观察', icon: <MapPin className="w-4 h-4" />, pathStep: 'act' },
        { id: 'k3', title: t.task3, points: 30, category: '感知', icon: <BookOpen className="w-4 h-4" />, pathStep: 'perceive' },
        { id: 'k4', title: t.task4, points: 200, category: '共建', icon: <Sparkles className="w-4 h-4" />, pathStep: 'co-build' },
      ]
    },
    university: {
      label: t.uniLabel,
      subLabel: t.uniSub,
      description: t.welcomeUni,
      tasks: [
        { id: 'u1', title: t.task5, points: 500, category: '审计', icon: <ClipboardCheck className="w-4 h-4" />, pathStep: 'act' },
        { id: 'u2', title: t.task6, points: 400, category: '策划', icon: <Sparkles className="w-4 h-4" />, pathStep: 'co-build' },
        { id: 'u3', title: t.task7, points: 300, category: '支持', icon: <Heart className="w-4 h-4" />, pathStep: 'experience' },
        { id: 'u4', title: t.task8, points: 1000, category: '认证', icon: <Award className="w-4 h-4" />, pathStep: 'perceive' },
      ]
    }
  };

  const RANKING_DATA = (role === 'k12' ? [
    { id: 1, name: lang === 'en' ? 'Lin' : '林小苔', points: 1200, avatar: 'L', school: lang === 'en' ? 'Kowloon Primary' : '九龙塘实验小学' },
    { id: 2, name: lang === 'en' ? 'Chen' : '陈小花', points: 1150, avatar: 'C', school: lang === 'en' ? 'HK Inclusive' : '香港融合中学' },
    { id: 3, name: user?.username || 'Me', points: points, avatar: 'M', school: user?.school || 'My School', isMe: true },
    { id: 4, name: lang === 'en' ? 'Zhang' : '张同学', points: 980, avatar: 'Z', school: lang === 'en' ? 'Kowloon College' : '九龙文理学院' },
  ] : [
    { id: 1, name: lang === 'en' ? 'Partner Zhou' : '周合伙人', points: 8500, avatar: 'Z', school: lang === 'en' ? 'HK University' : '香港大学' },
    { id: 2, name: lang === 'en' ? 'President Wu' : '吴社长', points: 7200, avatar: 'W', school: lang === 'en' ? 'CUHK' : '香港中文大学' },
    { id: 3, name: user?.username || 'Me', points: points, avatar: 'M', school: user?.school || 'My School', isMe: true },
    { id: 4, name: lang === 'en' ? 'Senior Zheng' : '郑学长', points: 6800, avatar: 'Z', school: lang === 'en' ? 'PolyU' : '香港理工大学' },
  ]).sort((a, b) => b.points - a.points);

  const MALL_ITEMS = role === 'k12' ? [
    { id: 1, name: lang === 'en' ? 'Sticker' : (lang === 'zh-HK' ? '苔花勳章貼紙' : '苔花勋章贴纸'), price: 100, category: lang === 'en' ? 'Stationery' : '文具', icon: <ShoppingBag className="w-6 h-6 text-emerald-500" /> },
    { id: 2, name: lang === 'en' ? 'Notebook' : (lang === 'zh-HK' ? '定制苔綠筆記本' : '定制苔绿笔记本'), price: 500, category: lang === 'en' ? 'Stationery' : '文具', icon: <BookOpen className="w-6 h-6 text-blue-500" /> },
    { id: 3, name: lang === 'en' ? 'Badge' : (lang === 'zh-HK' ? '苔花小觀察員徽章' : '苔花小观察员徽章'), price: 800, category: lang === 'en' ? 'Honor' : '荣誉', icon: <Award className="w-6 h-6 text-orange-500" /> },
    { id: 4, name: lang === 'en' ? 'Camp' : (lang === 'zh-HK' ? '公益研學營名額' : '公益研学营名额'), price: 2000, category: lang === 'en' ? 'Activity' : '活动', icon: <Globe className="w-6 h-6 text-purple-500" /> },
  ] : [
    { id: 1, name: lang === 'en' ? 'E-Cert' : (lang === 'zh-HK' ? '苔花合伙人電子證書' : '苔花合伙人电子证书'), price: 500, category: lang === 'en' ? 'Honor' : '荣誉', icon: <ShieldCheck className="w-6 h-6 text-emerald-500" /> },
    { id: 2, name: lang === 'en' ? 'Audit Kit' : (lang === 'zh-HK' ? '無障礙審核工具包' : '无障碍审核工具包'), price: 1500, category: lang === 'en' ? 'Tools' : '实物', icon: <ClipboardCheck className="w-6 h-6 text-blue-500" /> },
    { id: 3, name: lang === 'en' ? 'Exhibition' : (lang === 'zh-HK' ? '融合文化節策展位' : '融合文化节策展位'), price: 3000, category: lang === 'en' ? 'Rights' : '权益', icon: <LayoutGrid className="w-6 h-6 text-orange-500" /> },
    { id: 4, name: lang === 'en' ? 'Internship' : (lang === 'zh-HK' ? '知名公益機構實習內推' : '知名公益机构实习内推'), price: 5000, category: lang === 'en' ? 'Career' : '发展', icon: <TrendingUp className="w-6 h-6 text-purple-500" /> },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('moss_user');
    const savedOnboarding = localStorage.getItem('moss_onboarding');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    if (savedOnboarding) {
      setHasOnboarded(true);
    }
  }, []);

  const handleLoginComplete = (data: any) => {
    setUser(data);
    setIsLoggedIn(true);
    localStorage.setItem('moss_user', JSON.stringify(data));
  };

  const handleOnboardingComplete = () => {
    setHasOnboarded(true);
    localStorage.setItem('moss_onboarding', 'true');
  };

  const handleTaskClick = (task: Task) => {
    setPoints(p => p + task.points);
    setActiveStep(task.pathStep);
    setShowSuccess(task.points);
  };

  const handleExchange = (item: MallItem) => {
    if (points >= item.price) {
      setPoints(p => p - item.price);
      alert(`成功兑换：${item.name}！`);
    }
  };

  if (!isLoggedIn) {
    return <LoginFlow onComplete={handleLoginComplete} t={t} />;
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} t={t} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 pb-24 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal points={showSuccess} onClose={() => setShowSuccess(null)} t={t} />
        )}
        {showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} t={t} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MossLogo className="w-8 h-8 text-emerald-700" />
            <div className="flex flex-col">
              <h1 className="text-lg font-serif font-bold tracking-tight">{t.appName}</h1>
              <span className="text-[10px] text-stone-400 font-medium tracking-widest uppercase">{t.mossCovenant}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setLang(l => l === 'zh-CN' ? 'zh-HK' : l === 'zh-HK' ? 'en' : 'zh-CN')}
                className="p-2 text-stone-400 hover:text-emerald-600 transition-colors flex items-center gap-1"
                title="Switch Language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase">{lang.split('-')[1] || lang}</span>
              </button>
              <button 
                onClick={() => setShowFeedback(true)}
                className="p-2 text-stone-400 hover:text-emerald-600 transition-colors"
                title={t.feedback}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <div className="flex bg-stone-100 p-1 rounded-2xl">
              {(Object.keys(ROLE_CONFIG_STATIC) as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    role === r ? 'bg-white text-emerald-700 shadow-sm' : 'text-stone-400'
                  }`}
                >
                  {r === 'k12' ? t.k12Label : t.uniLabel}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* User Profile Summary */}
              <section className="mb-10 bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-800">{user?.username}</h3>
                    <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                      <School className="w-3 h-3" /> {user?.school}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">{t.currentLevel}</span>
                  <span className="text-xs font-bold text-emerald-600">{t.juniorObserver}</span>
                </div>
              </section>

              {/* Welcome Section */}
              <section className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3 h-3" />
                  {role === 'k12' ? t.k12Sub : t.uniSub}
                </div>
                <h2 className="text-3xl font-serif font-bold text-stone-800 mb-4 leading-tight">
                  {lang === 'en' ? (
                    <>
                      Moss flowers are as small as rice,<br />
                      yet they learn to <span className="text-emerald-600 italic">bloom like peonies</span>.
                    </>
                  ) : (
                    <>
                      {t.motto.split('，')[0]}，<br />
                      {t.motto.split('，')[1].split(lang === 'zh-HK' ? '牡丹開' : '牡丹开')[0]}
                      <span className="text-emerald-600 italic">{lang === 'zh-HK' ? '牡丹開' : '牡丹开'}</span>。
                    </>
                  )}
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed max-w-sm mx-auto">
                  {role === 'k12' ? t.welcome : t.welcomeUni}
                </p>
              </section>

              {/* User Path Navigation */}
              <section className="mb-12 bg-white p-8 rounded-[3rem] border border-stone-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-xl">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="text-xs font-bold text-stone-800 uppercase tracking-widest">{t.growthPath}</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{points} {t.points}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4 px-2">
                    {DYNAMIC_PATH_STEPS.map((step, idx) => (
                      <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                            activeStep === step.id ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-200' : 'bg-stone-100 text-stone-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[10px] font-medium ${activeStep === step.id ? 'text-emerald-700' : 'text-stone-400'}`}>
                            {step.label}
                          </span>
                        </div>
                        {idx < DYNAMIC_PATH_STEPS.length - 1 && (
                          <div className="h-[1px] flex-1 bg-stone-200 mx-2" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>

              {/* Activity Registration Section */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-stone-400" />
                    <h3 className="text-sm font-bold text-stone-800">{t.activityReg}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm relative overflow-hidden group cursor-pointer">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-bold text-stone-800 mb-1">
                        {role === 'k12' ? t.kowloonActivity : t.universityActivity}
                      </h4>
                      <p className="text-[10px] text-stone-400 font-medium leading-relaxed">
                        {t.activityDesc}
                      </p>
                    </div>
                    <button className="bg-stone-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-bold hover:bg-stone-800 transition-all shadow-lg shadow-stone-200 active:scale-95">
                      {t.apply}
                    </button>
                  </div>
                </div>
              </section>

              {/* Task Grid */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-stone-400" />
                    <h3 className="text-sm font-bold text-stone-800">{t.todayTask}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400">
                    <Footprints className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{t.oneStep}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {ROLE_CONFIG[role].tasks.map((task) => (
                    <motion.div 
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      onClick={() => handleTaskClick(task as Task)}
                      className="bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-stone-50 rounded-2xl text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          {task.icon}
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          DYNAMIC_PATH_STEPS.find(s => s.id === task.pathStep)?.color || 'bg-stone-100 text-stone-400'
                        }`}>
                          {DYNAMIC_PATH_STEPS.find(s => s.id === task.pathStep)?.label || t.category}
                        </span>
                      </div>
                      <h3 className="text-stone-800 font-bold text-sm leading-snug mb-3">{task.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                          <span className="text-xs font-bold text-emerald-600">{task.points}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-stone-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'ranking' && (
            <motion.div 
              key="ranking"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <section className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{t.rankTitle}</h2>
                <p className="text-stone-400 text-sm">{t.rankDesc}</p>
              </section>
              <RankingList role={role} data={RANKING_DATA} t={t} />
            </motion.div>
          )}

          {activeTab === 'mall' && (
            <motion.div 
              key="mall"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <section className="mb-10 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">{t.mallTitle}</h2>
                  <p className="text-stone-400 text-sm">{t.mallDesc}</p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">{t.myPoints}</span>
                  <span className="text-lg font-serif font-bold text-emerald-600">{points}</span>
                </div>
              </section>
              <PointsMall role={role} currentPoints={points} onExchange={handleExchange} items={MALL_ITEMS} t={t} mallImages={mallImages[role]} isGenerating={isGeneratingImages} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-stone-100 px-6 py-4 z-[90]">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t.home}</span>
          </button>
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'ranking' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t.ranking}</span>
          </button>
          <button 
            onClick={() => setActiveTab('mall')}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'mall' ? 'text-emerald-600' : 'text-stone-400'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t.mall}</span>
          </button>
        </div>
      </nav>

      {/* Minimal Footer */}
      <footer className="py-6 text-center opacity-30">
        <MossLogo className="w-6 h-6 mx-auto mb-4 text-stone-400" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
          Equality · Respect · Blooming
        </p>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="mt-4 text-[10px] text-stone-400 underline"
        >
          {t.reset}
        </button>
      </footer>
    </div>
  );
}
