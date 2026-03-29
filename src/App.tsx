/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Home as HomeIcon, 
  FileText, 
  Clock, 
  UserCheck, 
  ExternalLink, 
  QrCode,
  Trophy,
  Target,
  Users,
  Layers,
  ArrowLeft
} from 'lucide-react';

// --- Constants & Types ---

const BASE_WIDTH = 1080;
const BASE_HEIGHT = 1920;
const AUTO_RETURN_TIMEOUT = 180000; // 3 minutes

type Section = 'home' | 'announcement' | 'agenda' | 'guide' | 'tracks';

interface AgendaItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
  participants?: {
    role: string;
    name: string;
    title: string;
  }[];
  status: 'past' | 'current' | 'upcoming';
}

const AGENDA_DATA: Omit<AgendaItem, 'status'>[] = [
  { 
    time: '13:30-14:00', 
    title: '签到、媒体接待、领导嘉宾合影'
  },
  { 
    time: '14:00-14:05', 
    title: '主持人开场', 
    speaker: '姚方 | 广西壮族自治区医疗保障局副局长',
    description: '介绍到场领导嘉宾、宣讲会背景及议程说明。'
  },
  { 
    time: '14:05-14:15', 
    title: '国家医疗保障局致辞', 
    speaker: '曹文博 | 国家医疗保障局大数据中心副主任',
    description: '主题：以场景开放推动技术创新 促进医保数智化发展'
  },
  { 
    time: '14:15-14:25', 
    title: '广西壮族自治区医疗保障局致辞', 
    speaker: '张 奕 | 广西壮族自治区医疗保障局局长',
    description: '主题：依托医保影像云与智能推理能力 推进大赛筹备工作与医疗AI创新应用发展'
  },
  { 
    time: '14:25-14:45', 
    title: '专题报告', 
    speaker: '滕皋军 | 中国科学院院士，东南大学医学与生命科学部主任，东南大学附属中大医院院长',
    description: '主题：可信空间与云影像体系赋能医保智能监管的技术路径'
  },
  { 
    time: '14:45-15:05', 
    title: '专题报告', 
    speaker: '鹿晓亮 | 科大讯飞股份有限公司副总裁、讯飞医疗执行总裁',
    description: '主题：人工智能在医学影像中的应用'
  },
  { 
    time: '15:05-15:25', 
    title: '赛制解读', 
    speaker: '彭 涛 | 广西医科大学第一附属医院副院长',
    description: '主题：赛事解读和高质量影像数据集建设'
  },
  { 
    time: '15:25-15:50', 
    title: '茶歇及媒体专访'
  },
  { 
    time: '15:50-16:30', 
    title: '圆桌研讨', 
    description: '主题：医疗数字治理体系重构：技术、制度与协同创新',
    participants: [
      { role: '主持人', name: '薛华丹', title: '北京协和医院放射科副主任' },
      { role: '医疗专家', name: '陈  敏', title: '北京医院医学影像中心主任、中华医学会放射学分会主任委员' },
      { role: '医疗专家', name: '张  波', title: '中日友好医院超声医学科主任' },
      { role: '行业专家', name: '郑  超', title: '数坤科技股份有限公司CTO' },
      { role: '行业专家', name: '董  昢', title: '上海联影智能医疗科技有限公司CTO' },
      { role: '行业专家', name: '王  桐', title: '阿里巴巴达摩院医疗AI实验室商务合作副总经理' }
    ]
  },
  { 
    time: '16:30-17:00', 
    title: '现场交流与总结闭幕'
  },
];


const TRACKS = [
  'CT肺癌', 'CT肾癌', 'CTA颅内动脉瘤', 'MRI脑胶质瘤', 
  'MRI前列腺病变', '乳腺钼靶乳腺癌', '超声甲状腺癌', '胸部X光多病种检测'
];

// --- Components ---

const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const baseRatio = BASE_WIDTH / BASE_HEIGHT;

    let newScale = 1;
    if (windowRatio > baseRatio) {
      // Window is wider than 9:16, scale based on height
      newScale = windowHeight / BASE_HEIGHT;
    } else {
      // Window is narrower than 9:16, scale based on width
      newScale = windowWidth / BASE_WIDTH;
    }
    setScale(newScale);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div 
      className="fixed inset-0 bg-transparent flex items-start justify-start overflow-hidden origin-top-left"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div 
        ref={containerRef}
        className="relative bg-transparent text-white origin-top-left"
        style={{ 
          width: BASE_WIDTH, 
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Background = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Placeholder Background Image - Replace URL here */}
    <img 
      src="/北京宣讲会互动大屏bg.png" 
      alt="Background" 
      className="absolute inset-0 w-full h-full object-cover opacity-100 scale-100"
      referrerPolicy="no-referrer"
    />
    
    {/* Grid Effect */}
    <div className="absolute inset-0 opacity-5" 
      style={{ 
        backgroundImage: `linear-gradient(#003566 1px, transparent 1px), linear-gradient(90deg, #003566 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} 
    />

    {/* Abstract Glows */}
    <motion.div 
      animate={{ opacity: [0.1, 0.3, 0.1], y: [0, -20, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px]"
    />
  </div>
);

const Home = ({ onNavigate }: { onNavigate: (s: Section) => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekdayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const currentDateText = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${weekdayMap[time.getDay()]}`;

  return (
    <div className="h-full flex flex-col items-center justify-between py-28 px-12 relative z-10">
      {/* Header - Top */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-10 w-full"
      >
        <div className="text-white text-7xl font-medium tracking-[0.2em] opacity-90 leading-tight">
          2026年全国医保影像<br />AI识图大赛
        </div>
        <p className="text-[20px] font-semibold tracking-[0.06em] text-blue-100/90 whitespace-nowrap">
          NATIONAL HEALTHCARE SECURITY AI IMAGE RECOGNITION CONTEST
        </p>
        <h1 className="text-4xl font-black leading-tight text-white drop-shadow-2xl tracking-tight flex items-center justify-center gap-4">
          <span>宣讲会</span>
          <span className="text-white/75">·</span>
          <span>北京站</span>
        </h1>
        <div className="flex items-center justify-center space-x-6">
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent to-blue-400" />
          <p className="text-5xl font-light tracking-[0.4em] text-blue-100 uppercase">慧眼识图 影领未来</p>
          <div className="h-[2px] w-24 bg-gradient-to-l from-transparent to-blue-400" />
        </div>
      </motion.div>

      {/* Navigation Grid - Middle (Large Square Buttons) */}
      {/* 提示：在这里调整按钮的大小，修改 w-[440px] 和 h-[440px] 即可 */}
      <div className="grid grid-cols-2 gap-12 py-12 w-fit">
        {[
          { id: 'announcement', label: '大赛公告', sub: 'ANNOUNCEMENT', icon: FileText, color: 'blue' },
          { id: 'agenda', label: '北京站议程', sub: 'AGENDA', icon: Clock, color: 'blue' },
          { id: 'guide', label: '参赛指引', sub: 'GUIDE', icon: UserCheck, color: 'blue' },
          { id: 'tracks', label: '赛道介绍', sub: 'TRACKS', icon: Trophy, color: 'blue' },
        ].map((item, idx) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            onClick={() => onNavigate(item.id as Section)}
            className="w-[400px] h-[400px] rounded-[40px] bg-white/16 border-2 border-white/35 backdrop-blur-md flex flex-col items-center justify-center p-8 group relative overflow-hidden shadow-2xl"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Icon */}
            <div className="mb-8 p-6 rounded-3xl bg-white/10 border border-white/30 group-hover:bg-white/20 group-hover:border-white/45 transition-all relative">
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  opacity: [0.28, 0.7, 0.28],
                  scale: [1, 1.07, 1],
                  boxShadow: [
                    '0 0 10px rgba(147, 197, 253, 0.35), 0 0 22px rgba(59, 130, 246, 0.2)',
                    '0 0 24px rgba(191, 219, 254, 0.75), 0 0 42px rgba(59, 130, 246, 0.45)',
                    '0 0 10px rgba(147, 197, 253, 0.35), 0 0 22px rgba(59, 130, 246, 0.2)'
                  ]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: idx * 0.25
                }}
              />
              <item.icon className="w-20 h-20 text-white group-hover:text-white transition-colors relative z-10" />
            </div>

            {/* Labels */}
            <span className="text-4xl font-bold text-white mb-2 tracking-widest">{item.label}</span>
            <span className="text-xl text-white/85 font-medium tracking-[0.2em] uppercase">{item.sub}</span>
            
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500/0 group-hover:border-blue-500/50 transition-all rounded-tr-[40px]" />
          </motion.button>
        ))}
      </div>

      {/* Info & Clock - Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center space-y-6"
      >
        <div className="space-y-2">
          <p className="text-4xl text-white font-medium tracking-wide">中国 · 北京 · 广西大厦</p>
          <p className="text-xl text-white uppercase tracking-[0.3em]">Beijing · Guangxi Hotel</p>
        </div>
        
        <div className="w-[calc(100%+6rem)] -mx-12 py-6 bg-white/16 rounded-none border-0 backdrop-blur-md translate-y-28">
          <div className="text-9xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {time.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-3xl text-white mt-4 font-medium tracking-widest">{currentDateText}</div>
        </div>
      </motion.div>
    </div>
  );
};

const Announcement = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const navItems = [
    { id: 'intro', label: '赛事介绍' },
    { id: 'org', label: '组织机构' },
    { id: 'target', label: '参赛对象' },
    { id: 'cond', label: '参赛条件' },
    { id: 'content', label: '比赛内容' },
    { id: 'apply', label: '报名方式' },
    { id: 'schedule', label: '赛程赛制' },
    { id: 'awards', label: '奖项设置' },
    { id: 'data', label: '大赛数据' },
    { id: 'incentive', label: '大赛激励' },
    { id: 'others', label: '其他事项' },
  ];

  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    const target = document.getElementById(id);
    if (container && target) {
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      
      // Calculate the current scale factor from the ScaleWrapper
      // getBoundingClientRect returns scaled values, offsetWidth returns layout values
      const scale = containerRect.width / container.offsetWidth;
      
      // The visual distance in the viewport needs to be unscaled to match the scrollTop coordinate system
      const relativeTop = (targetRect.top - containerRect.top) / scale + container.scrollTop;
      
      container.scrollTo({
        top: relativeTop,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowBackToTop(scrollTop > 500);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-full flex flex-col pt-32 pb-40 px-12 relative z-10">
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-2 h-12 bg-blue-500 rounded-full" />
        <h2 className="text-6xl font-bold">大赛公告</h2>
      </div>

      <h1 className="text-5xl font-bold text-center mb-12 leading-tight tracking-tight text-white">
        全国医保影像 AI 识图大赛公告
      </h1>

      <div className="flex-1 flex flex-col bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl relative">
        {/* Sticky Navigation Directory */}
        <div className="p-8 border-b border-white/10 bg-white/5 backdrop-blur-md z-20">
          <div className="flex items-center space-x-4 mb-6">
            <Layers className="w-8 h-8 text-blue-400" />
            <span className="text-3xl font-bold text-blue-100 tracking-wider">公告目录</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-xl font-medium text-blue-100/60 hover:text-white hover:bg-blue-500/20 hover:border-blue-400/40 transition-all active:scale-95 text-center"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto no-scrollbar p-16 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-16 text-white/90">
            <section id="intro" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">一、</span>赛事介绍
              </h2>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                按照党中央、国务院决策部署，为落实《国家医保局关于加快医疗保障场景培育 开放支持新场景大规模应用的通知》要求，充分释放医保数据要素赋能作用，加快推进全民健康数智化建设，国家医疗保障局与广西壮族自治区人民政府联合举办主题为“慧眼识图 影领未来”的全国医保影像AI识图大赛，旨在推动新技术、新产品、新业态在医保领域大规模应用，更好地保障和改善民生，赋能经济社会发展。
              </p>
            </section>

            <section id="org" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">二、</span>组织机构
              </h2>
              <div className="text-2xl leading-[1.8] space-y-6 pl-12">
                <div className="flex">
                  <span className="font-bold text-white flex-shrink-0">主办单位：</span>
                  <span>国家医疗保障局、广西壮族自治区人民政府。</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-white flex-shrink-0">承办单位：</span>
                  <span>国家医疗保障局大数据中心，中国—东盟国家人工智能应用合作中心，广西壮族自治区医疗保障局、广西壮族自治区科技厅、广西壮族自治区卫生健康委员会、广西壮族自治区大数据发展局。</span>
                </div>
              </div>
            </section>

            <section id="target" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">三、</span>参赛对象
              </h2>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                本次大赛以团队为主体申请参赛。团队成员可来自国内外注册登记的企业、医疗卫生机构、高等院校、科研院所以及其他事业单位等。鼓励技术爱好者、学生等群体组团报名参赛。
              </p>
            </section>

            <section id="cond" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">四、</span>参赛条件
              </h2>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                参赛以团队形式进行，每支参赛团队应明确一名团队负责人，负责团队报名、赛事联络和成果提交等相关事项。每个参赛团队成员（含团队负责人）原则上不少于2人，不多于5人。同一团队成员可来自于不同机构，同一人只能参加一个团队，同一机构可派出多人组建多个团队。
              </p>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                团队成员所属机构如发现被“信用中国”网站（www.creditchina.gov.cn）列为失信惩戒对象，或被中国政府采购网（www.ccgp.gov.cn）列入政府采购严重违法失信名单，则取消参赛资格。
              </p>
            </section>

            <section id="content" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">五、</span>比赛内容
              </h2>
              <div className="space-y-12 pl-12">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white/80">（一）赛道设置</h3>
                  <p className="text-2xl leading-[1.8]">
                    大赛共设置8个赛道，均基于真实世界临床诊断路径设计，由主办方统一提供训练数据集及独立测试集：
                  </p>
                  <div className="grid grid-cols-1 gap-4 pl-6">
                    {[
                      '赛道一：基于CT的肺癌智能检测',
                      '赛道二：基于CT的肾癌智能检测',
                      '赛道三：基于CTA的颅内动脉瘤智能检测',
                      '赛道四：基于MRI的脑胶质瘤智能检测',
                      '赛道五：基于MRI的前列腺病变智能检测',
                      '赛道六：基于乳腺钼靶的乳腺癌智能检测',
                      '赛道七：基于超声的甲状腺癌智能检测',
                      '赛道八：基于胸部X光的多种疾病智能检测'
                    ].map((track, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-2xl text-white/70">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{track}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white/80">（二）比赛目标</h3>
                  <p className="text-2xl leading-[1.8] text-justify">
                    旨在赛出一批AI技术应用于医学影像辅助诊断的优秀成果，推进医保领域场景培育、开放和应用，提升诊疗效率，促进检查检验结果互认，让优质诊疗服务惠及基层。重点检验以下能力：一是检验并推动AI开展影像真实性识别，准确区分真人体、假人体和非人体影像；二是检验并推动AI开展影像规范性审核，识别重复影像、拼接影像等异常情形；三是检验并推动AI提升病灶识别能力，区分肿瘤性病变和非肿瘤性占位；四是检验并推动AI提升辅助诊断能力，支持肿瘤分期及相关疾病诊断分析；五是检验并推动AI提升影像判读效率，实现关键点位自动标注和诊断结论可解释。其中一、二项为参赛基础考核项，不达标则不得进入后续竞赛环节。
                  </p>
                </div>
              </div>
            </section>

            <section id="apply" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">六、</span>报名方式
              </h2>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                大赛采用网络报名方式。参赛团队请于2026年6月25日24:00前，通过大赛官方网站报名，填报提交团队信息，上传参赛承诺书、知识产权与合规声明、参赛技术意向书及相关证明材料扫描件。大赛相关信息详见大赛官方网站（https://ybystds.ybj.gxzf.gov.cn/）。
              </p>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                主办方在收到报名信息后5日内通过大赛官网站内信、手机短信和电子邮箱反馈审核结果。如通过审核，参赛团队即可参加初赛；如未通过审核，参赛团队可登录用户页面查看反馈信息，在大赛报名截止时间前进行修改后重新提交。
              </p>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em] font-bold text-blue-200">
                请参赛团队务必注意：修改报名信息请于2026年6月30日18:00前完成，逾期主办方将不再接受修改。
              </p>
            </section>

            <section id="schedule" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">七、</span>赛程赛制
              </h2>
              <div className="space-y-12 pl-12">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white/80">（一）初赛</h3>
                  <div className="text-2xl leading-[1.8] space-y-4">
                    <p>1.时间：2026年8月1日至9月30日；</p>
                    <p>2.比赛地点：线上；</p>
                    <p>3.参赛对象：各赛道所有通过报名审核的团队；</p>
                    <p>4.材料提交：各参赛团队将封装参赛模型的镜像提交到大赛平台进行模型训练及推理测试，并提交与模型相关的技术报告等参赛材料；</p>
                    <p>5.评审和公示：初赛评审采取线上模型推理测试自动化评分结合专家评审的形式。其中自动化评分主要考核参赛模型的推理性能及效率，专家评审主要评估算法思路的创新性、模型质量的可靠性、技术方案的合理性及独特性，并着重关注模型设计是否考虑医保应用场景中的数据异质性、真实世界复杂性及后续落地可扩展性。各参赛团队报名成功后可从大赛官网下载初赛评分细则。主办方根据初赛综合成绩，确定晋级团队名单并予以公示。</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white/80">（二）决赛</h3>
                  <div className="text-2xl leading-[1.8] space-y-4">
                    <p>1.时间：2026年10月中旬；</p>
                    <p>2.比赛地点：广西南宁；</p>
                    <p>3.参赛对象：各赛道初赛综合成绩排名靠前的若干团队；</p>
                    <p>4.材料提交：决赛演示文稿、系统部署方案、临床与工程验证资料（如有）等材料；</p>
                    <p>5.评审和公示：决赛评审采取线下集中答辩与专家综合打分的形式逐一对各赛道的参赛团队开展评审（主要评审模型性能效率、创新与鲁棒性、临床价值与可解释性以及工程化与推广潜力），主办方将在规定时间内对决赛获奖团队进行公示。</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="awards" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">八、</span>奖项设置
              </h2>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                大赛设置若干奖项，主办方将为每个获奖团队颁发获奖证书，提供成果展示、合作对接及转化孵化等配套支持。
              </p>
            </section>

            <section id="data" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">九、</span>大赛数据
              </h2>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                每个赛道均由主办方统一提供经专业医疗专家团队审核标注，涵盖阳性与阴性病例的医学影像数据集，全面支撑医学影像AI模型训练评测。所有数据均完成标准化脱敏与隐私保护处理且无法逆向溯源，严格遵守《中华人民共和国个人信息保护法》《中华人民共和国数据安全法》等相关法律法规，全程在安全可控的专属环境中使用。
              </p>
              <p className="text-2xl leading-[1.8] text-justify indent-[3em]">
                主办方将在大赛官网发布数据相关目录，参赛团队仅可在大赛专属环境中使用数据开展模型训练及测试，不得进行截图、拍照、录像等任何形式的传播操作。
              </p>
            </section>

            <section id="incentive" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">十、</span>大赛激励
              </h2>
              <div className="text-2xl leading-[1.8] space-y-6 pl-12">
                <div>
                  <span className="font-bold text-white">1.成果转化：</span>
                  <span>支持优秀获奖成果在广西壮族自治区注册落地，按照有关规定优先纳入新增或修订广西医疗服务价格目录；优先在广西区内三级定点医疗机构推广；优先纳入后续开发的应用场景对接名单，推动其在真实场景中验证应用；给予一定数额的成果转化专项经费支持。</span>
                </div>
                <div>
                  <span className="font-bold text-white">2.政策对接：</span>
                  <span>优秀获奖项目可获得场地、资金、人才等政策支持。</span>
                </div>
                <div>
                  <span className="font-bold text-white">3.生态培育：</span>
                  <span>优秀获奖团队将获邀参加医学影像产业对接会，深化与广西医疗机构合作。</span>
                </div>
              </div>
            </section>

            <section id="others" className="space-y-8">
              <h2 className="text-4xl font-bold text-blue-400 flex items-center">
                <span className="mr-4">十一、</span>其他事项
              </h2>
              <div className="space-y-12 pl-12">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white/80">（一）知识产权</h3>
                  <p className="text-2xl leading-[1.8]">1.主办方对在本次竞赛中所提供的所有数据、信息、软件、logo、商标等均享有合法权益。</p>
                  <p className="text-2xl leading-[1.8]">2.除双方另有约定外，参赛团队在比赛过程中独立开发的成果（包括但不限于算法、代码、技术报告、演示文稿等），其知识产权（含著作权、专利申请权等）归团队所有。</p>
                  <p className="text-2xl leading-[1.8]">3.参赛团队应保证参赛行为和参赛过程不得侵犯或非法使用第三方的知识产权等，如发生第三方向主办方提出索赔、诉讼等事项，参赛团队应独立负责解决、承担主办方由此产生的全部损失并消除因此造成的不利影响。</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white/80">（二）参赛费用</h3>
                  <p className="text-2xl leading-[1.8]">大赛报名、评审、宣传报道等不收取任何费用。参赛团队需自行承担参赛过程中产生的交通、食宿、视频制作、场景搭建、展品制作等费用。</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white/80">（三）参赛语言</h3>
                  <p className="text-2xl leading-[1.8]">大赛官方语言为中文，参赛团队可选择全程使用中文或者英文参赛，参赛期间语言一经选定不得变更。</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white/80">（四）赛事信息查阅</h3>
                  <p className="text-2xl leading-[1.8]">参赛团队可在大赛官方网站查阅参赛手册、评分标准及赛事相关安排。</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white/80">（五）问题咨询</h3>
                  <div className="text-2xl leading-[1.8] space-y-2">
                    <p>大赛咨询邮箱：contact@ybystds.com</p>
                    <p>大赛联系电话：</p>
                    <p className="pl-8">1. 0771-5601652（报名咨询）</p>
                    <p className="pl-8">2. 0771-5601656（报名咨询）</p>
                    <p className="pl-8">3. 0771-5601660（赛道及专业技术咨询）</p>
                    <p>工作日8:00-12:00，15:00-18:00</p>
                    <p>参赛团队可登录大赛官方网站的用户页面，使用站内信向主办方咨询并提出意见建议。主办方将统一收集、研究并合理采纳。</p>
                  </div>
                </div>
              </div>
              <p className="text-2xl leading-[1.8] text-justify pt-8">
                为保证赛事质量，主办方保留进一步调整大赛规程及奖项设置的权利。赛事相关事宜最终解释权归主办方所有。
              </p>
            </section>

            <footer className="pt-20 pb-10 text-right space-y-4">
              <div className="text-3xl font-bold">全国医保影像AI识图大赛组委会</div>
              <div className="text-2xl text-white/60">2026年3月19日</div>
            </footer>
          </div>
        </div>

        {/* Floating Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="absolute bottom-8 right-8 w-16 h-16 bg-blue-600/80 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors z-30"
            >
              <ArrowLeft className="w-8 h-8 rotate-90" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};



const Agenda = () => {
  const normalizeParticipants = (item: Omit<AgendaItem, 'status'>) => {
    if (item.participants?.length) return item.participants;
    if (!item.speaker) return [];

    const [leftRaw, rightRaw] = item.speaker.split('|');
    const left = leftRaw?.trim() || '';
    const title = rightRaw?.trim() || '特邀嘉宾';

    if (left.includes('：')) {
      const [role, name] = left.split('：');
      return [{ role: role.trim(), name: name?.trim() || '嘉宾', title }];
    }

    return [{ role: '嘉宾', name: left || '嘉宾', title }];
  };

  return (
    <div className="h-full flex flex-col pt-32 pb-40 px-8 relative z-10">
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-2 h-12 bg-blue-500 rounded-full" />
        <h2 className="text-6xl font-bold">北京站议程</h2>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-10 mb-16 backdrop-blur-md space-y-8">
        <div className="flex items-center">
          <Clock className="w-10 h-10 mr-6 text-blue-400" />
          <div className="text-4xl text-white font-bold tracking-wide">
            2026年3月31日 14:00 – 17:00
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-10 h-10 mr-6 text-blue-400 mt-1" />
          <div className="text-4xl text-white font-bold tracking-wide leading-snug">
            广西大厦二楼多功能厅
            <div className="text-2xl text-white/40 font-normal mt-2">北京市朝阳区潘家园华威里26号</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="space-y-20 pl-24">
          {AGENDA_DATA.map((item, idx) => {
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start"
              >
                {/* Left: Time */}
                <div className="w-64 pt-1 flex-shrink-0 text-right pr-12">
                  <span className="text-4xl font-mono font-bold whitespace-nowrap text-white/70">
                    {item.time}
                  </span>
                </div>

                {/* Middle: Dot & Line */}
                <div className="relative flex flex-col items-center px-6 pt-4">
                  <div className="w-5 h-5 rounded-full z-10 bg-white/20" />
                  {idx !== AGENDA_DATA.length - 1 && (
                    <div className="absolute top-9 w-[1px] h-40 bg-white/10" />
                  )}
                </div>

                {/* Right: Content */}
                <div className="flex-1 space-y-6">
                  <h3 className="text-4xl font-bold leading-snug text-white">
                    {item.title}
                  </h3>
                  
                  {normalizeParticipants(item).length > 0 && (
                    <div className="space-y-3 min-w-[500px] max-w-[800px]">
                      {normalizeParticipants(item).map((person, personIdx) => (
                        <div
                          key={`${person.name}-${personIdx}`}
                          className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md"
                        >
                          {item.participants?.length ? (
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-sm font-bold tracking-wide mb-3">
                              {person.role}
                            </div>
                          ) : null}
                          <div className="text-3xl font-bold text-white/90 mb-2">
                            {person.name}
                          </div>
                          <div className="text-2xl text-white/80 font-medium leading-relaxed">
                            {person.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.description && (
                    <div className="text-[30px] text-white/85 leading-relaxed max-w-[800px]">
                      {item.description}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Tracks Section ---

const TRACKS_DATA = [
  { id: 1, title: '基于CT的肺癌智能检测', desc: '本赛道以胸部 CT 影像为数据基础，围绕某一明确的肺部相关疾病案例，开展疾病相关影像异常的识别与分析任务。', image: '/track-01-hover.jpg' },
  { id: 2, title: '基于CT的肾癌智能检测', desc: '本赛道以腹部 CT 影像为数据基础，围绕某一明确的肾脏相关疾病案例，开展疾病相关影像异常的检测与定性分析任务。', image: '/track-02-hover.jpg' },
  { id: 3, title: '基于CTA的颅内动脉瘤智能检测', desc: '本赛道以头颈部 CTA 影像为数据基础，围绕某一明确的颅内血管疾病案例，开展影像异常识别、定位及分析任务。', image: '/track-03-hover.jpg' },
  { id: 4, title: '基于MRI的脑胶质瘤智能检测', desc: '本赛道以脑部 MRI 影像为数据基础，围绕某一明确的脑部肿瘤案例，开展结构性影像异常的识别、分割与分析任务。', image: '/track-04-hover.jpg' },
  { id: 5, title: '基于MRI的前列腺病变智能检测', desc: '本赛道以前列腺 MRI 影像为数据基础，围绕某一明确的前列腺相关疾病案例，开展病变区域影像异常的识别与分析任务。', image: '/track-05-hover.jpg' },
  { id: 6, title: '基于乳腺钼靶的乳腺癌智能检测', desc: '本赛道以乳腺钼靶影像为数据基础，围绕某一明确的乳腺相关疾病案例，开展影像异常识别与分类任务。', image: '/track-06-hover.jpg' },
  { id: 7, title: '基于超声的甲状腺癌智能检测', desc: '本赛道以甲状腺超声影像为数据基础，围绕某一明确的甲状腺相关疾病案例，开展影像特征异常的识别与诊断分析任务。', image: '/track-07-hover.jpg' },
  { id: 8, title: '基于胸部X光的多种疾病智能检测', desc: '本赛道以胸部 X 光影像为数据基础，围绕胸部多种常见疾病案例，开展多目标影像异常的检测与分类任务。', image: '/track-08-hover.jpg' },
];

const Tracks = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToTrack = (id: number) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(`track-${id}`);
    
    if (container && element) {
      // Set highlight
      setHighlightedId(id);
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = setTimeout(() => setHighlightedId(null), 3000);

      // Calculate position relative to container
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      const relativeTop = (elementRect.top - containerRect.top) / (containerRect.height / container.clientHeight);
      const targetScrollTop = container.scrollTop + relativeTop - (container.clientHeight / 2) + (element.clientHeight / 2);
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-full flex flex-col pt-32 pb-40 relative z-10">
      <div className="px-12 flex flex-col space-y-8 mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-2 h-12 bg-blue-500 rounded-full" />
          <h2 className="text-6xl font-bold text-white tracking-tight">赛道介绍</h2>
        </div>

        {/* Quick Positioning Bar - 4 columns per row */}
        <div className="grid grid-cols-4 gap-4 px-4 py-2">
          {TRACKS_DATA.map((track) => (
            <button
              key={track.id}
              onClick={() => scrollToTrack(track.id)}
              className={`px-2 py-4 border rounded-2xl text-xl transition-all active:scale-95 flex items-center justify-center text-center leading-tight ${
                highlightedId === track.id 
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-blue-600/40 hover:border-blue-500/50'
              }`}
            >
              {track.title.replace('影像', '')}
            </button>
          ))}
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar px-6"
      >
        <div className="space-y-12 pb-[600px]">
          {TRACKS_DATA.map((track, idx) => {
            const isEven = idx % 2 === 1;
            const isHighlighted = highlightedId === track.id;
            return (
              <motion.div
                key={track.id}
                id={`track-${track.id}`}
                initial={{ opacity: 0, x: isEven ? 100 : -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex w-full ${isEven ? 'justify-end' : 'justify-start'}`}
              >
                <div className="relative w-[85%] h-64">
                  {/* Enhanced Glow Layer (Behind the card) */}
                  {isHighlighted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                        scale: [1, 1.15, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -inset-12 bg-blue-600/40 blur-[80px] rounded-[60px] z-0"
                    />
                  )}

                  {/* Main Card */}
                  <motion.div 
                    animate={isHighlighted ? {
                      borderColor: "rgba(59, 130, 246, 1)",
                      scale: 1.02,
                      backgroundColor: "rgba(255, 255, 255, 0.18)"
                    } : {
                      borderColor: "rgba(255, 255, 255, 0.25)",
                      scale: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.12)"
                    }}
                    transition={{ duration: 0.4 }}
                    className={`
                      relative w-full h-full flex items-stretch overflow-hidden z-10
                      backdrop-blur-3xl border rounded-[40px]
                      shadow-2xl transition-all duration-500
                      ${isEven ? 'flex-row-reverse' : 'flex-row'}
                      ${isHighlighted ? 'ring-4 ring-blue-500/50' : ''}
                    `}
                  >
                    {/* Large Background Number */}
                    <div className={`absolute top-0 ${isEven ? 'left-8' : 'right-8'} text-[180px] font-black text-white/10 leading-none select-none pointer-events-none`}>
                      0{track.id}
                    </div>

                  {/* Image Part */}
                  <div className="w-2/5 relative overflow-hidden">
                    <img 
                      src={track.image} 
                      alt={track.title}
                      className="w-full h-full object-cover opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Content Part */}
                  <div className={`w-3/5 p-8 flex flex-col justify-center ${isEven ? 'text-right items-end' : 'text-left items-start'} space-y-3 relative z-10`}>
                    <div className="flex items-center space-x-3">
                      {!isEven && <div className="w-8 h-[2px] bg-blue-500" />}
                      <h3 className="text-4xl font-bold text-white tracking-wide">{track.title}</h3>
                      {isEven && <div className="w-8 h-[2px] bg-blue-500" />}
                    </div>
                    <p className="w-full text-left text-xl text-white/70 leading-relaxed font-light line-clamp-3">
                      {track.desc}
                    </p>
                    {/* <div className="pt-2 flex items-center text-white/90 text-lg font-medium group cursor-pointer">
                      {isEven && <ChevronRight className="w-5 h-5 mr-1 rotate-180" />}
                      <span>详情介绍</span>
                      {!isEven && <ChevronRight className="w-5 h-5 ml-1" />}
                    </div> */}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

const Guide = () => {
  return (
    <div className="h-full flex flex-col pt-32 pb-40 px-12 relative z-10 overflow-y-auto no-scrollbar">
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-2 h-12 bg-blue-500 rounded-full" />
        <h2 className="text-6xl font-bold tracking-tight">参赛指引</h2>
      </div>

      <div className="space-y-16 max-w-6xl">
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-2xl">1</div>
            <h3 className="text-4xl font-bold text-white/90">参赛对象及条件</h3>
          </div>
          <p className="text-2xl text-white/60 leading-relaxed text-justify pl-14">
            大赛以团队为主体参赛。团队成员可来自国内外注册登记的企业、医疗卫生机构、高等院校、科研院所以及其他事业单位等。鼓励技术爱好者、学生等群体组团报名参赛。每个参赛团队成员（含团队负责人）原则上不少于2人，不多于5人。同一团队成员可来自于不同机构，同一人只能参加一个团队，同一机构可派出多人组建多个团队。
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-2xl">2</div>
            <h3 className="text-4xl font-bold text-white/90">比赛内容</h3>
          </div>
          <div className="pl-14 space-y-4">
            <p className="text-2xl text-white/60">大赛共设置8个赛道：</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[
                '赛道一：基于CT的肺癌智能检测',
                '赛道二：基于CT的肾癌智能检测',
                '赛道三：基于CTA的颅内动脉瘤智能检测',
                '赛道四：基于MRI的脑胶质瘤智能检测',
                '赛道五：基于MRI的前列腺病变智能检测',
                '赛道六：基于乳腺钼靶的乳腺癌智能检测',
                '赛道七：基于超声的甲状腺癌智能检测',
                '赛道八：基于胸部X光的多种疾病智能检测'
              ].map((track, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-xl text-white/80">
                  {track}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-2xl">3</div>
            <h3 className="text-4xl font-bold text-white/90">大赛安排</h3>
          </div>
          <p className="text-2xl text-white/60 leading-relaxed pl-14">
            赛程分为初赛和决赛。
          </p>
        </section>

        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-2xl">4</div>
            <h3 className="text-4xl font-bold text-white/90">报名方式</h3>
          </div>
          <p className="text-2xl text-white/60 leading-relaxed text-justify pl-14">
            大赛采用网络报名方式。参赛团队通过大赛官方网站注册报名，填报提交团队信息，上传相关证明材料扫描件。
          </p>
          <div className="pl-14 pt-4 flex justify-center">
            <div className="bg-white rounded-2xl p-3 shadow-xl">
              <img
                src="/qr.png"
                alt="报名二维码"
                className="w-56 h-56 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Navigation = ({ active, onNavigate }: { active: Section, onNavigate: (s: Section) => void }) => (
  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-around px-8 z-50">
    {[
      { id: 'home', icon: HomeIcon, label: '首页' },
      { id: 'announcement', icon: FileText, label: '公告' },
      { id: 'agenda', icon: Clock, label: '议程' },
      { id: 'guide', icon: UserCheck, label: '指引' },
    ].map((item) => (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id as Section)}
        className={`flex flex-col items-center justify-center space-y-1 transition-all ${
          active === item.id ? 'text-blue-400 scale-110' : 'text-white/40'
        }`}
      >
        <item.icon className="w-8 h-8" />
        <span className="text-sm font-medium">{item.label}</span>
        {active === item.id && (
          <motion.div layoutId="nav-dot" className="w-1 h-1 bg-blue-400 rounded-full" />
        )}
      </button>
    ))}
  </div>
);

// --- Main App ---

export default function App() {
  const [currentSection, setCurrentSection] = useState<Section>('home');
  const lastInteractionTime = useRef(Date.now());

  useEffect(() => {
    const handleInteraction = () => {
      lastInteractionTime.current = Date.now();
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('scroll', handleInteraction, true);
    window.addEventListener('mousemove', handleInteraction);

    const interval = setInterval(() => {
      if (Date.now() - lastInteractionTime.current > AUTO_RETURN_TIMEOUT && currentSection !== 'home') {
        setCurrentSection('home');
      }
    }, 5000);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction, true);
      window.removeEventListener('mousemove', handleInteraction);
      clearInterval(interval);
    };
  }, [currentSection]);

  return (
    <ScaleWrapper>
      <Background />

      {currentSection !== 'home' && (
        <div className="absolute inset-0 bg-black/35 pointer-events-none z-[5]" />
      )}
      
      {/* Top Bar (Back Button only) */}
      <div
        className="absolute top-0 left-0 w-full h-24 px-12 flex items-center justify-end z-50 bg-transparent"
      >
        {currentSection !== 'home' && (
          <button 
            onClick={() => setCurrentSection('home')}
            className="flex items-center text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span className="text-xl">返回</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="h-full w-full relative z-10"
        >
          {currentSection === 'home' && <Home onNavigate={setCurrentSection} />}
          {currentSection === 'announcement' && <Announcement />}
          {currentSection === 'agenda' && <Agenda />}
          {currentSection === 'tracks' && <Tracks />}
          {currentSection === 'guide' && <Guide />}
        </motion.div>
      </AnimatePresence>
    </ScaleWrapper>
  );
}
