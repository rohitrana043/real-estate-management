// src/app/dashboard/messages/page.tsx
'use client';

import {
  AttachFile as AttachFileIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types for messages
interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  propertyId?: number;
  propertyTitle?: string;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [
      {
        id: 2,
        name: 'John Smith',
        avatar: '/assets/avatars/avatar-1.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 101,
      senderId: 2,
      recipientId: 1,
      content:
        "Hi, I'm interested in the apartment you listed. Is it still available?",
      timestamp: '2024-02-20T14:30:00Z',
      isRead: false,
    },
    unreadCount: 2,
    propertyId: 123,
    propertyTitle: 'Modern Apartment with City View',
  },
  {
    id: 2,
    participants: [
      {
        id: 3,
        name: 'Emma Johnson',
        avatar: '/assets/avatars/avatar-2.jpg',
        isOnline: false,
      },
    ],
    lastMessage: {
      id: 201,
      senderId: 1,
      recipientId: 3,
      content:
        'Thank you for your interest. When would you like to schedule a viewing?',
      timestamp: '2024-02-19T10:15:00Z',
      isRead: true,
    },
    unreadCount: 0,
    propertyId: 456,
    propertyTitle: 'Spacious Family Home',
  },
  {
    id: 3,
    participants: [
      {
        id: 4,
        name: 'Michael Brown',
        avatar: '/assets/avatars/avatar-3.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 301,
      senderId: 4,
      recipientId: 1,
      content:
        "I'd like to make an offer for the property. Can we discuss the details?",
      timestamp: '2024-02-18T16:45:00Z',
      isRead: true,
    },
    unreadCount: 0,
    propertyId: 789,
    propertyTitle: 'Downtown Commercial Space',
  },
];

// Mock data for messages in a conversation
const mockMessages: Record<number, Message[]> = {
  1: [
    {
      id: 101,
      senderId: 2,
      recipientId: 1,
      content:
        "Hi, I'm interested in the apartment you listed. Is it still available?",
      timestamp: '2024-02-20T14:30:00Z',
      isRead: false,
    },
    {
      id: 102,
      senderId: 2,
      recipientId: 1,
      content: 'I would like to schedule a viewing this weekend if possible.',
      timestamp: '2024-02-20T14:32:00Z',
      isRead: false,
    },
  ],
  2: [
    {
      id: 201,
      senderId: 3,
      recipientId: 1,
      content:
        "Hello, I saw your listing for the family home and I'm very interested.",
      timestamp: '2024-02-19T10:10:00Z',
      isRead: true,
    },
    {
      id: 202,
      senderId: 1,
      recipientId: 3,
      content:
        'Thank you for your interest. When would you like to schedule a viewing?',
      timestamp: '2024-02-19T10:15:00Z',
      isRead: true,
    },
  ],
  3: [
    {
      id: 301,
      senderId: 4,
      recipientId: 1,
      content:
        "I'd like to make an offer for the property. Can we discuss the details?",
      timestamp: '2024-02-18T16:45:00Z',
      isRead: true,
    },
  ],
};

// Current user ID (would come from auth context in a real app)
const currentUserId = 1;

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Load conversations
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchConversations = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setConversations(mockConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // In a real app, this would fetch from an API
      const fetchMessages = async () => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          const conversationMessages =
            mockMessages[selectedConversation.id] || [];
          setMessages(conversationMessages);

          // Mark messages as read
          if (selectedConversation.unreadCount > 0) {
            // Update conversation to mark messages as read
            setConversations((prevConversations) =>
              prevConversations.map((conv) =>
                conv.id === selectedConversation.id
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            );
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMessageObj: Message = {
      id: Date.now(), // Use a proper ID generation in a real app
      senderId: currentUserId,
      recipientId: selectedConversation.participants[0].id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Add message to current conversation
    setMessages((prevMessages) => [...prevMessages, newMessageObj]);

    // Update last message in conversations list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessageObj }
          : conv
      )
    );

    // Clear input
    setNewMessage('');
  };

  // Handle tab change (filter conversations)
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter conversations based on tab and search
  const filteredConversations = conversations.filter((conversation) => {
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const participantMatch = conversation.participants.some((p) =>
        p.name.toLowerCase().includes(searchLower)
      );
      const propertyMatch = conversation.propertyTitle
        ?.toLowerCase()
        .includes(searchLower);
      const messageMatch = conversation.lastMessage.content
        .toLowerCase()
        .includes(searchLower);

      if (!participantMatch && !propertyMatch && !messageMatch) {
        return false;
      }
    }

    // Filter by tab
    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Unread
        return conversation.unreadCount > 0;
      default:
        return true;
    }
  });

  // Format message timestamp for display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return format(date, 'h:mm a');
    } else {
      return format(date, 'MMM d');
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Page header */}
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Messages
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Conversations list */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Search and filter */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'neutral.main',
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search messages..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <FilterListIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="message tabs"
                    variant="fullWidth"
                  >
                    <Tab label="All" />
                    <Tab
                      label={`Unread (${conversations.reduce(
                        (count, conv) => count + conv.unreadCount,
                        0
                      )})`}
                    />
                  </Tabs>
                </Box>

                <List
                  sx={{
                    overflow: 'auto',
                    flexGrow: 1,
                    '& .MuiListItem-root:hover': {
                      backgroundColor: 'neutral.light',
                    },
                  }}
                >
                  {filteredConversations.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography color="text.secondary">
                        No conversations found
                      </Typography>
                    </Box>
                  ) : (
                    filteredConversations.map((conversation) => {
                      const participant = conversation.participants[0];
                      return (
                        <ListItem
                          key={conversation.id}
                          component="div"
                          sx={{
                            p: 2,
                            borderLeft:
                              selectedConversation?.id === conversation.id
                                ? '4px solid'
                                : 'none',
                            borderColor: 'primary.main',
                            backgroundColor:
                              selectedConversation?.id === conversation.id
                                ? 'neutral.light'
                                : 'inherit',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'neutral.light',
                            },
                          }}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <ListItemAvatar>
                            <Badge
                              color="success"
                              variant="dot"
                              invisible={!participant.isOnline}
                              overlap="circular"
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                              }}
                            >
                              <Avatar
                                src={participant.avatar}
                                alt={participant.name}
                              >
                                {participant.name.charAt(0)}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={
                                    conversation.unreadCount > 0 ? 600 : 400
                                  }
                                >
                                  {participant.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {formatMessageTime(
                                    conversation.lastMessage.timestamp
                                  )}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '180px',
                                    fontWeight:
                                      conversation.unreadCount > 0 ? 600 : 400,
                                    color:
                                      conversation.unreadCount > 0
                                        ? 'text.primary'
                                        : 'text.secondary',
                                  }}
                                >
                                  {conversation.lastMessage.senderId ===
                                  currentUserId
                                    ? 'You: '
                                    : ''}
                                  {conversation.lastMessage.content}
                                </Typography>
                                {conversation.propertyTitle && (
                                  <Typography
                                    variant="caption"
                                    color="primary"
                                    sx={{ display: 'block', mt: 0.5 }}
                                  >
                                    Re: {conversation.propertyTitle}
                                  </Typography>
                                )}
                              </Box>
                            }
                            primaryTypographyProps={{
                              fontWeight:
                                conversation.unreadCount > 0 ? 600 : 400,
                            }}
                            secondaryTypographyProps={{
                              component: 'div',
                            }}
                          />
                          {conversation.unreadCount > 0 && (
                            <Badge
                              badgeContent={conversation.unreadCount}
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </ListItem>
                      );
                    })
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Message thread */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  height: '70vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {selectedConversation ? (
                  <>
                    {/* Conversation header */}
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'neutral.main',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                          color="success"
                          variant="dot"
                          invisible={
                            !selectedConversation.participants[0].isOnline
                          }
                          overlap="circular"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                        >
                          <Avatar
                            src={selectedConversation.participants[0].avatar}
                            alt={selectedConversation.participants[0].name}
                          >
                            {selectedConversation.participants[0].name.charAt(
                              0
                            )}
                          </Avatar>
                        </Badge>
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {selectedConversation.participants[0].name}
                          </Typography>
                          {selectedConversation.participants[0].isOnline && (
                            <Typography variant="caption" color="success.main">
                              Online
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {/* Message thread */}
                    <Box
                      sx={{
                        p: 2,
                        flexGrow: 1,
                        overflow: 'auto',
                        backgroundColor: 'neutral.light',
                      }}
                    >
                      {selectedConversation.propertyTitle && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 3,
                            backgroundColor: 'neutral.main',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="body2">
                            This conversation is about{' '}
                            <Typography
                              component="span"
                              variant="body2"
                              color="primary"
                              fontWeight={600}
                              sx={{ cursor: 'pointer' }}
                              onClick={() =>
                                router.push(
                                  `/properties/${selectedConversation.propertyId}`
                                )
                              }
                            >
                              {selectedConversation.propertyTitle}
                            </Typography>
                          </Typography>
                        </Paper>
                      )}

                      {messages.map((message) => {
                        const isCurrentUser =
                          message.senderId === currentUserId;
                        return (
                          <Box
                            key={message.id}
                            sx={{
                              display: 'flex',
                              justifyContent: isCurrentUser
                                ? 'flex-end'
                                : 'flex-start',
                              mb: 2,
                            }}
                          >
                            {!isCurrentUser && (
                              <Avatar
                                src={
                                  selectedConversation.participants[0].avatar
                                }
                                alt={selectedConversation.participants[0].name}
                                sx={{ width: 32, height: 32, mr: 1 }}
                              >
                                {selectedConversation.participants[0].name.charAt(
                                  0
                                )}
                              </Avatar>
                            )}
                            <Box
                              sx={{
                                maxWidth: '70%',
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: isCurrentUser
                                  ? 'primary.main'
                                  : 'background.paper',
                                color: isCurrentUser
                                  ? 'primary.contrastText'
                                  : 'text.primary',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                              }}
                            >
                              <Typography variant="body1">
                                {message.content}
                              </Typography>
                              <Typography
                                variant="caption"
                                color={
                                  isCurrentUser
                                    ? 'primary.light'
                                    : 'text.secondary'
                                }
                                sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  textAlign: 'right',
                                }}
                              >
                                {formatMessageTime(message.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Message input */}
                    <Box
                      component="form"
                      sx={{
                        p: 2,
                        borderTop: '1px solid',
                        borderColor: 'neutral.main',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                    >
                      <IconButton sx={{ mr: 1 }}>
                        <AttachFileIcon />
                      </IconButton>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message..."
                        size="small"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        Send
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      p: 3,
                      backgroundColor: 'neutral.light',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        backgroundColor: 'primary.light',
                      }}
                    >
                      <SendIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" align="center" gutterBottom>
                      Select a conversation
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Choose a conversation from the list or start a new one
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
