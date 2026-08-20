import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  User,
  Story,
  Post,
  PostComment,
  Community,
  OneToOneMeeting,
  Referral,
  BusinessDeal,
  MeetingSummary,
  EventItem,
  MessageThread,
  Message,
} from '../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_STORIES,
  MOCK_POSTS,
  MOCK_COMMENTS,
  MOCK_COMMUNITIES,
  MOCK_ONE_TO_ONE_MEETINGS,
  MOCK_REFERRALS,
  MOCK_BUSINESS_DEALS,
  MOCK_MEETING_SUMMARIES,
  MOCK_EVENTS,
  MOCK_MESSAGE_THREADS,
  MOCK_MESSAGES,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  posts: Post[];
  stories: Story[];
  communities: Community[];
  oneToOneMeetings: OneToOneMeeting[];
  referrals: Referral[];
  businessDeals: BusinessDeal[];
  meetingSummaries: MeetingSummary[];
  events: EventItem[];
  messageThreads: MessageThread[];
  messages: Record<string, Message[]>;
  comments: Record<string, PostComment[]>;
  requestedAdminAccessIds: string[];
  isAuthenticated: boolean;

  // Modal State
  activeStory: Story | null;
  showStoryViewer: boolean;
  showBusinessCardModal: boolean;
  selectedBusinessCardUser: User | null;
  showLogOneToOneModal: boolean;
  targetOneToOneUser: User | null;
  showGiveReferralModal: boolean;
  targetReferralUser: User | null;
  showRecordDealModal: boolean;
  showCreatePostModal: boolean;
  showCommentsModal: boolean;
  selectedPostForComments: Post | null;
  showRequestAdminAccessModal: boolean;
  selectedUserForAdminAccess: User | null;
  showDrawer: boolean;
  activeSearchQuery: string;

  // Actions
  login: (user?: User) => void;
  logout: () => void;
  register: (newUser: Partial<User>) => void;
  switchUser: (userId: string) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createPost: (content: string, tag: Post['tag'], urgentRequirement?: boolean, budgetOrValue?: string) => void;
  logOneToOne: (withUserId: string, date: string, time: string, location: string, agenda: string) => void;
  giveReferral: (memberId: string, clientName: string, clientContact: string, serviceNeeded: string, estimatedValue: string, urgency: Referral['urgency']) => void;
  recordBusinessDeal: (toUserId: string, amountFormatted: string, amountInINR: number, dealDescription: string, referralType: BusinessDeal['referralType']) => void;
  toggleFollowUser: (userId: string) => void;
  toggleJoinCommunity: (communityId: string) => void;
  toggleRegisterEvent: (eventId: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  requestAdminContactAccess: (userId: string, reason: string) => void;
  
  // Modal Handlers
  openStory: (story: Story) => void;
  closeStory: () => void;
  openDigitalBusinessCard: (user?: User) => void;
  closeDigitalBusinessCard: () => void;
  openLogOneToOne: (user?: User) => void;
  closeLogOneToOne: () => void;
  openGiveReferral: (user?: User) => void;
  closeGiveReferral: () => void;
  openRecordDeal: () => void;
  closeRecordDeal: () => void;
  openCreatePost: () => void;
  closeCreatePost: () => void;
  openComments: (post: Post) => void;
  closeComments: () => void;
  openRequestAdminAccess: (user: User) => void;
  closeRequestAdminAccess: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setActiveSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [oneToOneMeetings, setOneToOneMeetings] = useState<OneToOneMeeting[]>(MOCK_ONE_TO_ONE_MEETINGS);
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [businessDeals, setBusinessDeals] = useState<BusinessDeal[]>(MOCK_BUSINESS_DEALS);
  const [meetingSummaries] = useState<MeetingSummary[]>(MOCK_MEETING_SUMMARIES);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(MOCK_MESSAGE_THREADS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [comments, setComments] = useState<Record<string, PostComment[]>>(MOCK_COMMENTS);
  const [requestedAdminAccessIds, setRequestedAdminAccessIds] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Modals state
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showBusinessCardModal, setShowBusinessCardModal] = useState(false);
  const [selectedBusinessCardUser, setSelectedBusinessCardUser] = useState<User | null>(null);
  const [showLogOneToOneModal, setShowLogOneToOneModal] = useState(false);
  const [targetOneToOneUser, setTargetOneToOneUser] = useState<User | null>(null);
  const [showGiveReferralModal, setShowGiveReferralModal] = useState(false);
  const [targetReferralUser, setTargetReferralUser] = useState<User | null>(null);
  const [showRecordDealModal, setShowRecordDealModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [showRequestAdminAccessModal, setShowRequestAdminAccessModal] = useState(false);
  const [selectedUserForAdminAccess, setSelectedUserForAdminAccess] = useState<User | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState('');

  // Authentication Handlers
  const login = (user?: User) => {
    if (user) {
      setCurrentUser(user);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const register = (newUser: Partial<User>) => {
    const createdUser: User = {
      id: `usr_${Date.now()}`,
      name: newUser.name || 'New Council Member',
      designation: newUser.designation || 'Managing Director',
      companyName: newUser.companyName || 'Bengal Enterprises Ltd.',
      industry: newUser.industry || 'Manufacturing & Trade',
      chapter: newUser.chapter || 'Kolkata Central Chapter',
      location: newUser.location || 'Kolkata, WB',
      gstNumber: newUser.gstNumber || '19AAACB1234F1Z5',
      isGstVerified: true,
      turnover: newUser.turnover || '₹ 10 Cr - ₹ 25 Cr',
      yearJoined: 2026,
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      membershipTier: 'Executive Member',
      bio: newUser.bio || `${newUser.name} is the executive leader of ${newUser.companyName}, operating in ${newUser.industry} in West Bengal.`,
      requirementDocs: [
        { title: 'Company_Profile_Capabilities.pdf', size: '2.8 MB', type: 'PDF' },
        { title: 'Verified_GST_Certificate.pdf', size: '1.1 MB', type: 'PDF' },
      ],
      contact: {
        email: newUser.contact?.email || 'member@bengalbusinesscouncil.com',
        phone: newUser.contact?.phone || '+91 98300 00000',
        website: newUser.contact?.website || 'https://bengalbusinesscouncil.com',
        officeAddress: newUser.contact?.officeAddress || 'Salt Lake Sector V, Kolkata, WB 700091',
      },
      stats: {
        oneToOneCount: 0,
        referralsGiven: 0,
        referralsReceived: 0,
        businessValueInLakhs: 0,
      },
    };

    setUsers(prev => [createdUser, ...prev]);
    setCurrentUser(createdUser);
    setIsAuthenticated(true);
  };

  // Actions
  const toggleLikePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      postId,
      authorName: currentUser.name,
      authorCompany: currentUser.companyName,
      authorAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Just now',
    };

    setComments(prev => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])],
    }));

    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
      )
    );
  };

  const createPost = (
    content: string,
    tag: Post['tag'],
    urgentRequirement?: boolean,
    budgetOrValue?: string
  ) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorDesignation: currentUser.designation,
      authorCompany: currentUser.companyName,
      authorAvatar: currentUser.avatar,
      chapter: currentUser.chapter,
      createdAt: 'Just now',
      content,
      tag,
      urgentRequirement,
      budgetOrValue,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      sharesCount: 0,
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const logOneToOne = (
    withUserId: string,
    date: string,
    time: string,
    location: string,
    agenda: string
  ) => {
    const target = users.find(u => u.id === withUserId) || users[1];
    const newMeeting: OneToOneMeeting = {
      id: `oto_${Date.now()}`,
      withUserId: target.id,
      withUserName: target.name,
      withUserCompany: target.companyName,
      withUserAvatar: target.avatar,
      date: date || 'Upcoming',
      time: time || '11:00 AM',
      status: 'Scheduled',
      locationOrLink: location || 'BBC Secretariat Boardroom',
      agenda: agenda || 'B2B Strategic discussion & capabilities sharing.',
    };

    setOneToOneMeetings(prev => [newMeeting, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        oneToOneCount: prev.stats.oneToOneCount + 1,
      },
    }));
  };

  const giveReferral = (
    memberId: string,
    clientName: string,
    clientContact: string,
    serviceNeeded: string,
    estimatedValue: string,
    urgency: Referral['urgency']
  ) => {
    const target = users.find(u => u.id === memberId) || users[1];
    const newRef: Referral = {
      id: `ref_${Date.now()}`,
      type: 'Given By Me',
      memberId: target.id,
      memberName: target.name,
      memberCompany: target.companyName,
      memberAvatar: target.avatar,
      clientOrProspectName: clientName,
      clientContact: clientContact,
      serviceNeeded: serviceNeeded,
      date: 'Today',
      status: 'New Lead',
      estimatedValue: estimatedValue || '₹ 25 Lakhs',
      urgency: urgency || 'Immediate',
    };

    setReferrals(prev => [newRef, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        referralsGiven: prev.stats.referralsGiven + 1,
      },
    }));
  };

  const recordBusinessDeal = (
    toUserId: string,
    amountFormatted: string,
    amountInINR: number,
    dealDescription: string,
    referralType: BusinessDeal['referralType']
  ) => {
    const target = users.find(u => u.id === toUserId) || users[1];
    const newDeal: BusinessDeal = {
      id: `deal_${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserCompany: currentUser.companyName,
      toUserId: target.id,
      toUserName: target.name,
      toUserCompany: target.companyName,
      amountInINR: amountInINR || 1000000,
      amountFormatted: amountFormatted || '₹ 10.0 Lakhs',
      dealDescription: dealDescription || 'B2B Purchase order executed',
      date: 'Today',
      referralType: referralType || 'Inside Council',
    };

    setBusinessDeals(prev => [newDeal, ...prev]);
    const addedLakhs = (amountInINR || 1000000) / 100000;
    setCurrentUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        businessValueInLakhs: prev.stats.businessValueInLakhs + addedLakhs,
      },
    }));
  };

  const toggleFollowUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isFollowed: !u.isFollowed } : u))
    );
  };

  const toggleJoinCommunity = (communityId: string) => {
    setCommunities(prev =>
      prev.map(c => {
        if (c.id === communityId) {
          const isJoined = !c.isJoined;
          return {
            ...c,
            isJoined,
            membersCount: isJoined ? c.membersCount + 1 : c.membersCount - 1,
          };
        }
        return c;
      })
    );
  };

  const toggleRegisterEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(e => {
        if (e.id === eventId) {
          const isRegistered = !e.isRegistered;
          return {
            ...e,
            isRegistered,
            attendeesCount: isRegistered ? e.attendeesCount + 1 : e.attendeesCount - 1,
          };
        }
        return e;
      })
    );
  };

  const sendMessage = (threadId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      threadId,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Just now',
      isMe: true,
    };

    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMsg],
    }));

    setMessageThreads(prev =>
      prev.map(th =>
        th.id === threadId
          ? { ...th, lastMessage: text.trim(), lastMessageTime: 'Just now' }
          : th
      )
    );
  };

  const requestAdminContactAccess = (userId: string, _reason: string) => {
    setRequestedAdminAccessIds(prev => (prev.includes(userId) ? prev : [...prev, userId]));
  };

  // Modal helpers
  const openStory = (story: Story) => {
    setActiveStory(story);
    setShowStoryViewer(true);
    setStories(prev =>
      prev.map(s => (s.id === story.id ? { ...s, viewed: true } : s))
    );
  };
  const closeStory = () => {
    setShowStoryViewer(false);
    setActiveStory(null);
  };

  const openDigitalBusinessCard = (user?: User) => {
    setSelectedBusinessCardUser(user || currentUser);
    setShowBusinessCardModal(true);
  };
  const closeDigitalBusinessCard = () => {
    setShowBusinessCardModal(false);
    setSelectedBusinessCardUser(null);
  };

  const openLogOneToOne = (user?: User) => {
    setTargetOneToOneUser(user || null);
    setShowLogOneToOneModal(true);
  };
  const closeLogOneToOne = () => {
    setShowLogOneToOneModal(false);
    setTargetOneToOneUser(null);
  };

  const openGiveReferral = (user?: User) => {
    setTargetReferralUser(user || null);
    setShowGiveReferralModal(true);
  };
  const closeGiveReferral = () => {
    setShowGiveReferralModal(false);
    setTargetReferralUser(null);
  };

  const openRecordDeal = () => setShowRecordDealModal(true);
  const closeRecordDeal = () => setShowRecordDealModal(false);

  const openCreatePost = () => setShowCreatePostModal(true);
  const closeCreatePost = () => setShowCreatePostModal(false);

  const openComments = (post: Post) => {
    setSelectedPostForComments(post);
    setShowCommentsModal(true);
  };
  const closeComments = () => {
    setShowCommentsModal(false);
    setSelectedPostForComments(null);
  };

  const openRequestAdminAccess = (user: User) => {
    setSelectedUserForAdminAccess(user);
    setShowRequestAdminAccessModal(true);
  };
  const closeRequestAdminAccess = () => {
    setShowRequestAdminAccessModal(false);
    setSelectedUserForAdminAccess(null);
  };

  const openDrawer = () => setShowDrawer(true);
  const closeDrawer = () => setShowDrawer(false);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts,
        stories,
        communities,
        oneToOneMeetings,
        referrals,
        businessDeals,
        meetingSummaries,
        events,
        messageThreads,
        messages,
        comments,
        requestedAdminAccessIds,
        isAuthenticated,

        activeStory,
        showStoryViewer,
        showBusinessCardModal,
        selectedBusinessCardUser,
        showLogOneToOneModal,
        targetOneToOneUser,
        showGiveReferralModal,
        targetReferralUser,
        showRecordDealModal,
        showCreatePostModal,
        showCommentsModal,
        selectedPostForComments,
        showRequestAdminAccessModal,
        selectedUserForAdminAccess,
        showDrawer,
        activeSearchQuery,

        login,
        logout,
        register,
        switchUser,
        toggleLikePost,
        addComment,
        createPost,
        logOneToOne,
        giveReferral,
        recordBusinessDeal,
        toggleFollowUser,
        toggleJoinCommunity,
        toggleRegisterEvent,
        sendMessage,
        requestAdminContactAccess,

        openStory,
        closeStory,
        openDigitalBusinessCard,
        closeDigitalBusinessCard,
        openLogOneToOne,
        closeLogOneToOne,
        openGiveReferral,
        closeGiveReferral,
        openRecordDeal,
        closeRecordDeal,
        openCreatePost,
        closeCreatePost,
        openComments,
        closeComments,
        openRequestAdminAccess,
        closeRequestAdminAccess,
        openDrawer,
        closeDrawer,
        setActiveSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
