**Supabase Table Structure**:  
- **id** (_primary key_)
- topic  
- subtopic  
- question_latex  
- answer  
- answer_fields  
- diagram

90 Subtopics  
~ 3-9 questions per subtopic  
= 270 - 810 questions total

Add a way to choose certain questions via a specific page  
User prompted to browse Question ID's via a looooong list  

Add friends system with lobby invites and live chat 
Live chat can be implemented via Supabase Realtime

Show user stats and compare against friends

---

Table structure for Lobby and Players

Lobby:
- LobbyID (same as join code)
- Host UUID
- Max Players
- Topics/Subtopics
- Time Limit (NULL = no time limit, INT = time limit)
- Questions (INT)
- Created at
- Ended (BOOL)
- Winner (UUID of winner)

Players:  
- UUID
- LobbyID
---
Alter Questions table to add leaderboard to each question

Questions:
-
