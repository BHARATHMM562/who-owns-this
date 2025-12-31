// API client for WHO OWNS THIS? backend
// Configure VITE_API_URL in your .env file

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Team {
  _id: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  leaderId: string;
}

export interface Member {
  _id: string;
  memberId: string;
  name: string;
  teamId: string;
}

export interface Task {
  _id: string;
  taskId: string;
  title: string;
  ownerId: string;
  deadline: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  teamId: string;
}

export interface CreateTeamResponse {
  team: Team;
  member: Member;
}

export interface JoinTeamResponse {
  team: Team;
  member: Member;
  isNewMember: boolean;
}

// Create a new team
export async function createTeam(teamName: string, leaderName: string): Promise<CreateTeamResponse> {
  const response = await fetch(`${API_URL}/team/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName, leaderName }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create team');
  }
  
  return response.json();
}

// Join an existing team (also acts as login)
export async function joinTeam(memberName: string, teamCode: string): Promise<JoinTeamResponse> {
  const response = await fetch(`${API_URL}/team/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberName, teamCode }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to join team');
  }
  
  return response.json();
}

// Get all members of a team
export async function getMembers(teamId: string): Promise<Member[]> {
  const response = await fetch(`${API_URL}/members/${teamId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch members');
  }
  
  return response.json();
}

// Get all tasks for a team
export async function getTasks(teamId: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks/${teamId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch tasks');
  }
  
  return response.json();
}

// Create a new task (leader only)
export async function createTask(
  title: string,
  ownerId: string,
  deadline: string,
  teamId: string,
  leaderId: string
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, ownerId, deadline, teamId, leaderId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task');
  }
  
  return response.json();
}

// Update task status (owner only)
export async function updateTaskStatus(
  taskId: string,
  status: Task['status'],
  memberId: string
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, memberId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task');
  }
  
  return response.json();
}
