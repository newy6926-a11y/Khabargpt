import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Share2,
  Copy,
  Check,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Globe,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { KhabarLogo } from '../components/KhabarLogo';
import { SiteSettings } from '../types';

interface KnowledgeQuizPageProps {
  settings?: SiteSettings;
  onNavigate?: (path: string) => void;
}

interface QuizQuestion {
  id: string;
  topicId: string;
  questionNp: string;
  questionEn: string;
  optionsNp: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationNp: string;
  explanationEn: string;
  sourceReference: string;
  referenceDate: string;
}

const TOPICS = [
  {
    id: 'geography-heritage',
    nameNp: 'नेपालको भूगोल, संस्कृति तथा सम्पदा',
    nameEn: 'Geography, Heritage & Culture of Nepal',
    descNp: 'सगरमाथा, जैविक विविधता, विश्व सम्पदा सूची र नेपाली मौलिक चाडपर्वहरू सम्बन्धी जानकारी।',
    descEn: 'Mount Everest, biodiversity, UNESCO World Heritage Sites, and indigenous traditions.'
  },
  {
    id: 'constitution-civic',
    nameNp: 'नेपालको संविधान र नागरिक अधिकार',
    nameEn: 'Constitution of Nepal & Civic Rights',
    descNp: 'मौलिक हक, तीन तहको शासन प्रणाली, नागरिक कर्तव्य र कानुनी सचेतना।',
    descEn: 'Fundamental rights, three tiers of governance, civic duties, and legal literacy.'
  },
  {
    id: 'digital-literacy',
    nameNp: 'डिजिटल साक्षरता, मिडिया र तथ्य जाँच',
    nameEn: 'Digital Media Literacy & Fact-Checking',
    descNp: 'गलत सूचना (Misinformation), साइबर सुरक्षा, AI पहिचान र तथ्य प्रमाणीकरण।',
    descEn: 'Spotting misinformation, cyber safety, AI verification, and reliable sourcing.'
  },
  {
    id: 'economy-science',
    nameNp: 'अर्थतन्त्र, विज्ञान तथा वातावरण',
    nameEn: 'Economy, Science & Environment',
    descNp: 'नेप्से, सुनचाँदी, रेमिट्यान्स, जलवायु परिवर्तन र नेपालको ऊर्जा क्षेत्र।',
    descEn: 'NEPSE, gold rates, remittance, climate resilience, and renewable energy in Nepal.'
  }
];

const QUESTIONS: QuizQuestion[] = [
  // 1. Geography & Heritage
  {
    id: 'geo-1',
    topicId: 'geography-heritage',
    questionNp: 'नेपालको आधिकारिक उचाइ (सगरमाथाको नयाँ उचाइ) कति कायम गरिएको छ?',
    questionEn: 'What is the officially measured height of Mount Everest recognized by Nepal and China?',
    optionsNp: ['८,८४८ मिटर', '८,८४८.८६ मिटर', '८,८५० मिटर', '८,८४४.४३ मिटर'],
    optionsEn: ['8,848 meters', '8,848.86 meters', '8,850 meters', '8,844.43 meters'],
    correctIndex: 1,
    explanationNp: 'नेपाल सरकार र चीन सरकारले संयुक्त नापजाँच गरी २०२० डिसेम्बर ८ मा सगरमाथाको नयाँ आधिकारिक उचाइ ८,८४८.८६ मिटर घोषणा गरेका हुन्।',
    explanationEn: 'The governments of Nepal and China jointly surveyed and officially announced the revised height of 8,848.86 meters on December 8, 2020.',
    sourceReference: 'नापी विभाग, भूमि व्यवस्था मन्त्रालय (Department of Survey, Nepal)',
    referenceDate: 'December 2020'
  },
  {
    id: 'geo-2',
    topicId: 'geography-heritage',
    questionNp: 'काठमाडौँ उपत्यकाका कतिवटा सम्पदा क्षेत्रहरू युनेस्कोको विश्व सम्पदा सूचीमा सूचीकृत छन्?',
    questionEn: 'How many monument zones comprise the UNESCO Kathmandu Valley World Heritage site?',
    optionsNp: ['५ वटा', '७ वटा', '९ वटा', '१० वटा'],
    optionsEn: ['5 zones', '7 zones', '9 zones', '10 zones'],
    correctIndex: 1,
    explanationNp: 'काठमाडौँ उपत्यका विश्व सम्पदा क्षेत्रभित्र ३ दरबार स्क्वायर (वसन्तपुर, पाटन, भक्तपुर), २ बौद्ध स्तुप (स्वयम्भू, बौद्धनाथ) र २ हिन्दु मन्दिर (पशुपतिनाथ, चाँगुनारायण) गरी ७ वटा क्षेत्र पर्दछन्।',
    explanationEn: 'The Kathmandu Valley UNESCO World Heritage property encompasses 7 monument zones: 3 Durbar Squares, Swayambhu, Boudha, Pashupatinath, and Changu Narayan.',
    sourceReference: 'UNESCO World Heritage Centre (Ref: 121bis)',
    referenceDate: '1979 / Updated 2024'
  },
  {
    id: 'geo-3',
    topicId: 'geography-heritage',
    questionNp: 'नेपालको संविधान अनुसार नेपालको राष्ट्रिय झण्डाको लम्बाइ र चौडाइको अनुपात निर्धारण गर्ने गणितीय विधि कुन अनुसूचीमा छ?',
    questionEn: 'Which schedule of the Constitution of Nepal specifies the exact geometric construction of the National Flag?',
    optionsNp: ['अनुसूची १', 'अनुसूची २', 'अनुसूची ३', 'अनुसूची ४'],
    optionsEn: ['Schedule 1', 'Schedule 2', 'Schedule 3', 'Schedule 4'],
    correctIndex: 0,
    explanationNp: 'नेपालको संविधानको अनुसूची–१ मा नेपालको राष्ट्रिय झण्डा बनाउने गणितीय विधि र ज्यामितीय अनुपात स्पष्ट रूपमा व्यवस्था गरिएको छ।',
    explanationEn: 'Schedule 1 of the Constitution of Nepal details the precise mathematical and geometric instructions to construct the two-pennant national flag.',
    sourceReference: 'नेपालको संविधान (२०७२), अनुसूची १',
    referenceDate: '२०७२ असोज'
  },

  // 2. Constitution & Civic
  {
    id: 'const-1',
    topicId: 'constitution-civic',
    questionNp: 'नेपालको संविधान (२०७२) मा कतिवटा मौलिक हकको व्यवस्था गरिएको छ?',
    questionEn: 'How many Fundamental Rights are enshrined in Part 3 of the Constitution of Nepal?',
    optionsNp: ['२१ वटा', '२७ वटा', '३१ वटा', '३५ वटा'],
    optionsEn: ['21 rights', '27 rights', '31 rights', '35 rights'],
    correctIndex: 2,
    explanationNp: 'नेपालको संविधानको भाग ३, धारा १६ देखि ४६ सम्म जम्मा ३१ वटा मौलिक हकहरूको व्यवस्था गरिएको छ।',
    explanationEn: 'Part 3 (Articles 16 through 46) of the Constitution of Nepal establishes 31 fundamental human and civic rights for citizens.',
    sourceReference: 'नेपालको संविधान (२०७२), भाग ३ (धारा १६-४६)',
    referenceDate: '२०७२ असोज'
  },
  {
    id: 'const-2',
    topicId: 'constitution-civic',
    questionNp: 'नेपालमा सूचनाको हक (Right to Information) सम्बन्धी ऐन कुन सालमा जारी भएको थियो?',
    questionEn: 'In which year was the Right to Information Act enacted in Nepal?',
    optionsNp: ['वि.सं. २०४७', 'वि.सं. २०६४', 'वि.सं. २०७२', 'वि.सं. २०७५'],
    optionsEn: ['2047 BS (1990)', '2064 BS (2007)', '2072 BS (2015)', '2075 BS (2018)'],
    correctIndex: 1,
    explanationNp: 'नेपालमा सार्वजनिक निकायबाट सूचना प्राप्त गर्ने नागरिक अधिकार कार्यान्वयन गर्न सूचनाको हक सम्बन्धी ऐन, २०६४ जारी भएको हो।',
    explanationEn: 'The Right to Information Act, 2064 was enacted in 2007 to ensure citizens access to information held by public bodies.',
    sourceReference: 'राष्ट्रिय सूचना आयोग (National Information Commission, Nepal)',
    referenceDate: '२०६४ भाद्र'
  },
  {
    id: 'const-3',
    topicId: 'constitution-civic',
    questionNp: 'नेपालको वर्तमान शासन प्रणाली अनुसार स्थानीय तहको संख्या कति रहेको छ?',
    questionEn: 'How many local government units (Local Levels) currently exist in Nepal across 77 districts?',
    optionsNp: ['७५३ वटा', '७४४ वटा', '७६० वटा', '७५० वटा'],
    optionsEn: ['753 units', '744 units', '760 units', '750 units'],
    correctIndex: 0,
    explanationNp: 'नेपालमा ६ महानगरपालिका, ११ उपमहानगरपालिका, २७६ नगरपालिका र ४६० गाउँपालिका गरी जम्मा ७५३ वटा स्थानीय तह रहेका छन्।',
    explanationEn: 'Nepal has exactly 753 local level bodies: 6 Metropolises, 11 Sub-metropolises, 276 Municipalities, and 460 Rural Municipalities.',
    sourceReference: 'संघीय मामिला तथा सामान्य प्रशासन मन्त्रालय (MoFAGA)',
    referenceDate: '२०७४ / अद्यावधिक २०२६'
  },

  // 3. Digital Literacy & Fact-Checking
  {
    id: 'media-1',
    topicId: 'digital-literacy',
    questionNp: 'सामाजिक सञ्जालमा आएको कुनै पनि तस्बिर वा भिडियो वास्तविक हो कि होइन भनेर जाँच्न सबैभन्दा पहिलो चरण के हुनुपर्छ?',
    questionEn: 'What is the most effective initial step to verify whether an online viral image is authentic or recycled?',
    optionsNp: [
      'तत्काल साथीहरूलाई शेयर गरेर सोध्ने',
      'तस्बिरको रिभर्स इमेज सर्च (Reverse Image Search) गर्ने र मूल मिति/स्रोत खोज्ने',
      'सबैभन्दा धेरै लाइक भएको कमेन्टलाई विश्वास गर्ने',
      'स्क्रिनशट लिएर फेसबुकमा पोस्ट गरिहाल्ने'
    ],
    optionsEn: [
      'Immediately share it to friends to ask their opinion',
      'Perform a Reverse Image Search to locate original context, date, and source',
      'Trust whichever comment has the highest number of likes',
      'Take a screenshot and repost it instantly'
    ],
    correctIndex: 1,
    explanationNp: 'Google Images, TinEye वा Yandex जस्ता टुलमा तस्बिर अपलोड गरी रिभर्स सर्च गर्दा उक्त तस्बिर विगतमा कुन मितिमा र कुन सन्दर्भमा छापिएको थियो भन्ने स्पष्ट हुन्छ।',
    explanationEn: 'Reverse image searching using tools like Google Lens or TinEye identifies when, where, and in what context the visual was originally published.',
    sourceReference: 'International Fact-Checking Network (IFCN) Standards',
    referenceDate: 'Fact-Checking Handbook 2025/2026'
  },
  {
    id: 'media-2',
    topicId: 'digital-literacy',
    questionNp: 'नेपालमा अनलाइन वित्तीय ठगीबाट बच्न बैंक वा मोबाइल वालेटको OTP (One Time Password) कसलाई दिनु सुरक्षित हुन्छ?',
    questionEn: 'Whom is it safe to share your banking or mobile wallet OTP (One-Time Password) with?',
    optionsNp: [
      'बैंकको कर्मचारी भनी फोन गर्ने जोसुकैलाई',
      'लहान अफर वा पुरस्कार जितेको सन्देश पठाउने प्रतिनिधिलाई',
      'कसैलाई पनि होइन; बैंक कर्मचारीले कहिल्यै गोप्य OTP माग्दैनन्',
      'सामाजिक सञ्जालमा आधिकारिक देखिने पेजको म्यासेजमा'
    ],
    optionsEn: [
      'Anyone calling claiming to be a bank officer',
      'Promotional representatives offering lottery rewards',
      'Nobody; authentic bank staff will never request your secret OTP',
      'Customer support chats on social media'
    ],
    correctIndex: 2,
    explanationNp: 'नेपाल राष्ट्र बैंक र सम्पूर्ण वाणिज्य बैंकहरूको नियमअनुसार OTP व्यक्तिगत गोप्य कोड हो। कुनै पनि आधिकारिक संस्थाले ग्राहकसँग OTP माग्दैन।',
    explanationEn: 'Nepal Rastra Bank regulations state OTPs and PINs are private credentials. Legitimate institutions never ask customers to disclose them.',
    sourceReference: 'नेपाल राष्ट्र बैंक (Nepal Rastra Bank) वित्तीय साक्षरता निर्देशिका',
    referenceDate: '२०८१/२०८२'
  },
  {
    id: 'media-3',
    topicId: 'digital-literacy',
    questionNp: 'AI (आर्टिफिसियल इन्टेलिजेन्स) द्वारा सिर्जना गरिएको नक्कली तस्बिर पहिचान गर्न मुख्यतया के ध्यान दिनुपर्छ?',
    questionEn: 'What subtle visual artifact often helps detect an AI-generated synthetic human photo?',
    optionsNp: [
      'तस्बिरको फाइल साइज मात्र हेरेर',
      'हातका औंलाहरू, कानका गहना, पृष्ठभूमिमा लेखिएका अक्षरहरूको बनावट र छाया',
      'तस्बिरमा रातो रङ बढी हुनु',
      'मोबाइलको स्क्रिन उज्यालो बनाउनु'
    ],
    optionsEn: [
      'Looking solely at the file size',
      'Examining unnatural hands/fingers, jewelry symmetry, blurred background lettering, and unnatural lighting reflections',
      'Checking if the image has red hues',
      'Increasing phone screen brightness'
    ],
    correctIndex: 1,
    explanationNp: 'वर्तमान AI मोडेलहरूले हातका औंलाहरू, दाँतको बनावट, पृष्ठभूमिमा रहेका सडक संकेत वा अक्षरहरू र आँखाको पुतलीमा पर्ने प्रकाशको छायामा अस्वाभाविक त्रुटिहरू देखाउने गर्छन्।',
    explanationEn: 'Generative AI tools frequently produce glitches in hand anatomy, jewelry symmetry, iris reflections, and garbled background text.',
    sourceReference: 'Digital Forensics & Media Integrity Guide',
    referenceDate: '2026'
  },

  // 4. Economy, Science & Environment
  {
    id: 'eco-1',
    topicId: 'economy-science',
    questionNp: 'नेपाल स्टक एक्सचेन्ज (NEPSE) मा सेयर कारोबार राफसाफ कुन समयावधि (Settlement Cycle) मा हुने गर्छ?',
    questionEn: 'What is the standard trade settlement cycle in the Nepal Stock Exchange (NEPSE)?',
    optionsNp: ['T+1 (कारोबारको भोलिपल्ट)', 'T+2 (कारोबार भएको २ कार्यदिनभित्र)', 'T+3 (कारोबार भएको ३ दिनपछि)', 'T+5 (एक हप्तापछि)'],
    optionsEn: ['T+1 (Next day)', 'T+2 (Within 2 working days)', 'T+3 (3 working days)', 'T+5 (5 working days)'],
    correctIndex: 1,
    explanationNp: 'नेपाल धितोपत्र बोर्ड (SEBON) र CDS & Clearing को नियम अनुसार नेपालमा सेयर किनबेचको राफसाफ T+2 प्रणालीमा सञ्चालन हुन्छ।',
    explanationEn: 'Under Securities Board of Nepal (SEBON) rules, securities settlement in NEPSE operates on a standard T+2 working day cycle.',
    sourceReference: 'नेपाल धितोपत्र बोर्ड (SEBON) / CDSC',
    referenceDate: '२०७७ चैत देखि लागू'
  },
  {
    id: 'eco-2',
    topicId: 'economy-science',
    questionNp: 'नेपालमा सुनको शुद्धता मापन गर्दा २४ क्यारेट (24 Carat) छापावाल सुनमा कति प्रतिशत शुद्ध सुन हुन्छ?',
    questionEn: 'What is the fine gold percentage in 24 Carat hallmark gold traded in Nepal?',
    optionsNp: ['९१.६ प्रतिशत', '९५.० प्रतिशत', '९९.९ प्रतिशत (वा ९९.५% भन्दा माथि)', '१०० प्रतिशत'],
    optionsEn: ['91.6 percent', '95.0 percent', '99.9 percent (or 99.5%+)', '100 percent'],
    correctIndex: 2,
    explanationNp: 'नेपाल सुनचाँदी व्यवसायी महासंघका अनुसार २४ क्यारेट छापावाल सुन न्यूनतम ९९.५% देखि ९९.९% सम्म शुद्ध हुन्छ। (२२ क्यारेट तेजाबी सुन ९१.६% हुन्छ)।',
    explanationEn: 'Standard 24K hallmark fine gold requires a minimum purity of 99.5% to 99.99%. 22K (hallmarked) consists of 91.6% purity.',
    sourceReference: 'नेपाल सुनचाँदी व्यवसायी महासंघ (FNEGJ)',
    referenceDate: '२०८१/२०८२'
  },
  {
    id: 'eco-3',
    topicId: 'economy-science',
    questionNp: 'नेपालको पहिलो भू-उपग्रह (Nano-satellite) को नाम के थियो, जसलाई वि.सं. २०७६ मा प्रक्षेपण गरिएको थियो?',
    questionEn: "What was the name of Nepal's first nano-satellite launched into orbit in 2019?",
    optionsNp: ['नेपालीस्याट–१ (NepaliSat-1)', 'सगरमाथा–१ (Sagarmatha-1)', 'लुम्बिनी–१ (Lumbini-1)', 'डाँफे–१ (Danphe-1)'],
    optionsEn: ['NepaliSat-1', 'Sagarmatha-1', 'Lumbini-1', 'Danphe-1'],
    correctIndex: 0,
    explanationNp: 'नेपाल विज्ञान तथा प्रविधि प्रज्ञा प्रतिष्ठान (NAST) का वैज्ञानिक आभास मास्के र हरिराम श्रेष्ठद्वारा निर्मित नेपालीस्याट–१ (NepaliSat-1) वैशाख २०७६ मा सफलतापूर्वक प्रक्षेपण भएको थियो।',
    explanationEn: 'Developed under NAST initiatives by Nepali scientists Aabhas Maskey and Hari Ram Shrestha, NepaliSat-1 was launched in April 2019.',
    sourceReference: 'नेपाल विज्ञान तथा प्रविधि प्रज्ञा प्रतिष्ठान (NAST)',
    referenceDate: 'वि.सं. २०७६ वैशाख'
  }
];

export const KnowledgeQuizPage: React.FC<KnowledgeQuizPageProps> = ({ settings, onNavigate }) => {
  const [lang, setLang] = useState<'np' | 'en'>('np');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Filtered Questions by selected topic
  const activeQuestions =
    selectedTopicId === 'all'
      ? QUESTIONS
      : QUESTIONS.filter((q) => q.topicId === selectedTopicId);

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];
  const totalQuestions = activeQuestions.length;

  // Answer selection handler
  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // Already answered
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
    setShowExplanation(true);
  };

  // Next / Previous Navigation
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowExplanation(true);
    }
  };

  // Restart Quiz
  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsCompleted(false);
  };

  // Calculate Score
  const score = Object.entries(selectedAnswers).reduce((acc, [idxStr, selectedOpt]) => {
    const qIndex = parseInt(idxStr, 10);
    const q = activeQuestions[qIndex];
    if (q && selectedOpt === q.correctIndex) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  // Grade Assessment
  let gradeTextNp = 'उत्कृष्ट ज्ञान! तपाईं समसामयिक विषय र तथ्यमा निकै सचेत हुनुहुन्छ।';
  let gradeTextEn = 'Excellent knowledge! You are well-informed on civic and factual topics.';
  if (percentage < 50) {
    gradeTextNp = 'राम्रो प्रयास! थप अध्ययन र जानकारीका लागि खबर GPT का सामग्रीहरू उपयोगी हुनेछन्।';
    gradeTextEn = 'Good effort! Exploring Khabar GPT explainers will help deepen your knowledge.';
  } else if (percentage < 80) {
    gradeTextNp = 'प्रशंसनीय नतिजा! अधिकांश मुख्य विषयहरूमा तपाईंको बुझाइ स्पष्ट छ।';
    gradeTextEn = 'Commendable result! You have a solid grasp of most key topics.';
  }

  // Share text builder
  const handleShareResult = async () => {
    const shareText =
      lang === 'np'
        ? `मैले खबर GPT अन्तरक्रियात्मक हाजिरीजवाफ (Quiz) मा ${totalQuestions} मध्ये ${score} अङ्क (${percentage}%) प्राप्त गरेँ! तपाईं पनि आफ्नो ज्ञान जाँच्नुहोस्:`
        : `I scored ${score}/${totalQuestions} (${percentage}%) on the Khabar GPT Knowledge Quiz! Test your awareness here:`;
    const fullText = `${shareText}\n${window.location.origin}/quiz`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Khabar GPT Knowledge Quiz',
          text: fullText
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } else {
      navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* 1. Header with Khabar GPT Identity and Language Switcher */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <KhabarLogo size="sm" customUrl={settings?.customLogoUrl || '/logo.png'} title={settings?.siteTitle || 'Khabar GPT'} />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block">
                शैक्षिक तथा चेतनामूलक हाजिरीजवाफ
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {lang === 'np' ? 'खबर GPT अन्तरक्रियात्मक ज्ञान क्विज' : 'Khabar GPT Knowledge Quiz'}
              </h1>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setLang('np')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                lang === 'np' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              नेपाली
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Mandatory Educational Purpose Disclaimer */}
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>
              {lang === 'np' ? 'अनिवार्य सूचना:' : 'Mandatory Disclaimer:'}
            </strong>{' '}
            {lang === 'np'
              ? 'यो हाजिरीजवाफ केवल सामान्य शैक्षिक तथा सूचनामूलक उद्देश्यका लागि तयार पारिएको हो। यसको नतिजा कुनै आधिकारिक परीक्षाको अङ्क, पेशागत मूल्याङ्कन वा योग्यताको प्रमाणपत्र होइन।'
              : 'Quizzes are provided for general educational and informational purposes. Results are not an official examination score, professional assessment or certification.'}
          </p>
        </div>

        {/* Topic Filters */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            {lang === 'np' ? 'विषय छनोट (Select Topic):' : 'Select Topic:'}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedTopicId('all');
                handleRestart();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedTopicId === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {lang === 'np' ? 'सबै विषयहरू (All Topics)' : 'All Topics'}
            </button>
            {TOPICS.map((top) => (
              <button
                key={top.id}
                onClick={() => {
                  setSelectedTopicId(top.id);
                  handleRestart();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTopicId === top.id
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {lang === 'np' ? top.nameNp : top.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Active Quiz Card or Completed Summary */}
      {!isCompleted ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress & Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>
                {lang === 'np' ? 'प्रश्न' : 'Question'} {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="font-mono text-slate-900">
                {lang === 'np' ? 'हालसम्मको अङ्क:' : 'Current Score:'} {score}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question Text */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {lang === 'np' ? currentQ.questionNp : currentQ.questionEn}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.optionsNp.map((optNp, optIdx) => {
              const optText = lang === 'np' ? optNp : currentQ.optionsEn[optIdx];
              const isSelected = selectedAnswers[currentIndex] === optIdx;
              const hasAnswered = selectedAnswers[currentIndex] !== undefined;
              const isCorrect = optIdx === currentQ.correctIndex;

              let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'border-red-500 bg-red-50 text-red-950 font-semibold';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-70';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-relaxed">{optText}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box (Visible after answer) */}
          {showExplanation && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs leading-relaxed animate-in fade-in">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>{lang === 'np' ? 'तथ्यपरक व्याख्या तथा सन्दर्भ:' : 'Factual Explanation & Reference:'}</span>
              </div>
              <p className="text-slate-700">
                {lang === 'np' ? currentQ.explanationNp : currentQ.explanationEn}
              </p>
              <div className="pt-1 text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                <span>स्रोत: {currentQ.sourceReference}</span>
                <span>·</span>
                <span>सन्दर्भ मिति: {currentQ.referenceDate}</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'np' ? 'अघिल्लो' : 'Previous'}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentIndex] === undefined}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>
                {currentIndex === totalQuestions - 1
                  ? lang === 'np'
                    ? 'नतिजा हेर्नुहोस्'
                    : 'View Results'
                  : lang === 'np'
                  ? 'अर्को प्रश्न'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 3. Completed Results Summary Card */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in zoom-in-95">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-full bg-red-50 text-red-600 border border-red-100">
              <Award className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'np' ? 'हाजिरीजवाफ सम्पन्न भयो!' : 'Quiz Completed!'}
            </h2>

            {/* Score Ring / Pill */}
            <div className="py-2">
              <div className="inline-block px-6 py-3 rounded-2xl bg-slate-900 text-white font-mono text-2xl font-bold">
                {score} / {totalQuestions} ({percentage}%)
              </div>
            </div>

            <p className="text-sm font-medium text-slate-700 max-w-md mx-auto leading-relaxed">
              {lang === 'np' ? gradeTextNp : gradeTextEn}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === 'np' ? 'पुन: सुरु गर्नुहोस्' : 'Restart Quiz'}</span>
            </button>

            <button
              onClick={handleShareResult}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? (lang === 'np' ? 'कपी भयो!' : 'Copied!') : lang === 'np' ? 'नतिजा शेयर गर्नुहोस्' : 'Share Result'}</span>
            </button>
          </div>

          {/* Detailed Question Review List */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-600" />
              <span>{lang === 'np' ? 'सम्पूर्ण प्रश्न तथा व्याख्या समीक्षा (Review)' : 'Full Question Review'}</span>
            </h3>

            <div className="space-y-3">
              {activeQuestions.map((q, qIndex) => {
                const userAns = selectedAnswers[qIndex];
                const isCorrect = userAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {qIndex + 1}. {lang === 'np' ? q.questionNp : q.questionEn}
                      </span>
                      {isCorrect ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          सही
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
                          गलत
                        </span>
                      )}
                    </div>

                    <div className="text-slate-600">
                      <strong>{lang === 'np' ? 'सही उत्तर:' : 'Correct Answer:'}</strong>{' '}
                      <span className="text-emerald-800 font-semibold">
                        {lang === 'np' ? q.optionsNp[q.correctIndex] : q.optionsEn[q.correctIndex]}
                      </span>
                    </div>

                    <p className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                      {lang === 'np' ? q.explanationNp : q.explanationEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
