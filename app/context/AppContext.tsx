import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import { MenteeAPI } from "../api/mentees";
import { MentorshipAPI } from "../api/mentorships";
import { TaskAPI } from "../api/tasks";
import { PhaseAPI } from "../api/phases";

export type UserRole = "mentee" | "mentor";

export type TaskStatus = "pending" | "submitted" | "approved" | "rejected";
export type PhaseStatus = "current" | "completed" | "upcoming";

export type Attachment = {
  id: string;
  name: string;
  sizeLabel: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  xp: number;

  dueDate: string;
  dueDateFormatted: string;

  status: TaskStatus;

  expectedTime?: {
    value: number;
    unit: "hours" | "days" | "weeks";
  };

  skills?: string[];
  resources?: any[];

  submittedResponse?: string;
  submittedAt?: string;
  attachments?: Attachment[];

  mentorFeedback?: string;
  reviewedAt?: string;
};

export type Phase = {
  id: string;
  name: string;
  status: PhaseStatus;

  startDate: string;
  startDateFormatted: string;

  endDate: string;
  endDateFormatted: string;

  tasks: Task[];
};

export type ProfileData = {
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  resume: string | null;
  headline: string;
  bio: string;
  goals: string;
  industries: string[];
  skills: string[];
  links: string[];
};

export type QuestionnaireAnswers = {
  mentoringComfort: number;
  industry: string;
  mentorIndustry: string;
  mentorSkillset: string;
  developmentGoal: string;
  holdingBack: string;
};

type AppContextValue = {
  userRole: UserRole;
  toggleRole: () => void;

  totalXP: number;
  xpGoal: number;
  phases: Phase[];
  loading: boolean;
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  questionnaireAnswers: QuestionnaireAnswers;
  setQuestionnaireAnswers: React.Dispatch<
    React.SetStateAction<QuestionnaireAnswers>
  >;

  // PHASE
  addPhase: (name: string, startDate: string, endDate: string) => Promise<void>;
  editPhase: (
    id: string,
    name: string,
    startDate: string,
    endDate: string,
  ) => Promise<void>;
  deletePhase: (id: string) => Promise<void>;

  // TASK
  addTaskToPhase: (
    phaseId: string,
    title: string,
    dueDate: string,
    expectedTime?: Task["expectedTime"],
    skills?: string[],
    resources?: any[],
  ) => Promise<void>;

  editTask: (
    phaseId: string,
    taskId: string,
    title: string,
    dueDate: string,
    expectedTime?: Task["expectedTime"],
    skills?: string[],
    resources?: any[],
  ) => Promise<void>;

  deleteTask: (taskId: string) => Promise<void>;

  submitTask: (taskId: string, response: string) => Promise<void>;
  addMockAttachment: (phaseId: string, taskId: string) => void;

  reviewTask: (
    taskId: string,
    decision: "approved" | "rejected",
    feedback: string,
  ) => Promise<void>;

  updateTaskDescription: (taskId: string, desc: string) => Promise<void>;

  refreshPhases: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

// ---------------- helpers ----------------

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US");
}

function mapPhases(data: any[]): Phase[] {
  return data.map((p) => ({
    id: p._id,
    name: p.name,

    startDate: p.startDate,
    startDateFormatted: formatDate(p.startDate),

    endDate: p.endDate,
    endDateFormatted: formatDate(p.endDate),

    status: p.status,

    tasks: (p.tasks || []).map((t: any) => ({
      id: t._id,
      title: t.title,
      description: t.description,
      xp: t.xp ?? 0,

      dueDate: t.dueDate,
      dueDateFormatted: formatDate(t.dueDate),

      status: t.status,

      expectedTime: t.expectedTime,
      skills: t.skills,
      resources: t.resources,

      submittedResponse: t.submissionText,
      submittedAt: t.submittedAt ? formatDate(t.submittedAt) : undefined,
      attachments: (t.submissionFiles || []).map((file: any, index: number) => ({
        id: file._id ?? `${t._id}-file-${index}`,
        name: file.name ?? `Attachment ${index + 1}`,
        sizeLabel:
          typeof file.sizeBytes === "number"
            ? `${(file.sizeBytes / 1024).toFixed(1)} KB`
            : "Unknown size",
      })),

      mentorFeedback: t.mentorFeedback,
      reviewedAt: t.reviewedAt ? formatDate(t.reviewedAt) : undefined,
    })),
  }));
}

// ---------------- provider ----------------

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("mentee");
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    profilePicture: null,
    resume: null,
    headline: "",
    bio: "",
    goals: "",
    industries: [],
    skills: [],
    links: [],
  });
  const [questionnaireAnswers, setQuestionnaireAnswers] =
    useState<QuestionnaireAnswers>({
      mentoringComfort: 5,
      industry: "",
      mentorIndustry: "",
      mentorSkillset: "",
      developmentGoal: "",
      holdingBack: "",
    });

  const mentorshipId = "69e27a39b628f49f70d766db";
  const xpGoal = 2000;

  async function refreshTotalXP() {
    try {
      const mentorship = await MentorshipAPI.getById(mentorshipId);
      const menteeId = mentorship?.menteeId;

      if (!menteeId) {
        setTotalXP(0);
        return;
      }

      const xpData = await MenteeAPI.getXp(menteeId);
      setTotalXP(typeof xpData?.xp === "number" ? xpData.xp : 0);
    } catch {
      setTotalXP(0);
    }
  }

  async function refreshPhases() {
    try {
      setLoading(true);
      const [data] = await Promise.all([
        PhaseAPI.getByMentorship(mentorshipId),
        refreshTotalXP(),
      ]);
      setPhases(mapPhases(data));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshPhases();
  }, []);

  // PHASE
  async function addPhase(name: string, startDate: string, endDate: string) {
    await PhaseAPI.create({
      mentorshipId,
      name,
      description: "",
      startDate,
      endDate,
    });
    await refreshPhases();
  }

  async function editPhase(
    id: string,
    name: string,
    startDate: string,
    endDate: string,
  ) {
    await PhaseAPI.update(id, { name, startDate, endDate });
    await refreshPhases();
  }

  async function deletePhase(id: string) {
    await PhaseAPI.remove(id);
    await refreshPhases();
  }

  // TASK
  async function addTaskToPhase(
    phaseId: string,
    title: string,
    dueDate: string,
    expectedTime?: Task["expectedTime"],
    skills?: string[],
    resources?: any[],
  ) {
    await TaskAPI.create({
      phaseId,
      title,
      dueDate,
      expectedTime,
      skills,
      resources,
    });

    await refreshPhases();
  }

  async function editTask(
    phaseId: string,
    taskId: string,
    title: string,
    dueDate: string,
    expectedTime?: Task["expectedTime"],
    skills?: string[],
    resources?: any[],
  ) {
    await TaskAPI.update(taskId, {
      title,
      dueDate,
      expectedTime,
      skills,
      resources,
    });

    await refreshPhases();
  }

  async function deleteTask(taskId: string) {
    await TaskAPI.delete(taskId);
    await refreshPhases();
  }

  async function submitTask(taskId: string, response: string) {
    await TaskAPI.submit(taskId, response);
    await refreshPhases();
  }

  function addMockAttachment(phaseId: string, taskId: string) {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id !== phaseId
          ? phase
          : {
              ...phase,
              tasks: phase.tasks.map((task) => {
                if (task.id !== taskId) return task;

                const nextAttachment: Attachment = {
                  id: `a-${Math.random().toString(16).slice(2)}`,
                  name: `attachment-${(task.attachments?.length ?? 0) + 1}.pdf`,
                  sizeLabel: "120.0 KB",
                };

                return {
                  ...task,
                  attachments: [...(task.attachments ?? []), nextAttachment],
                };
              }),
            },
      ),
    );
  }

  async function reviewTask(
    taskId: string,
    decision: "approved" | "rejected",
    feedback: string,
  ) {
    await TaskAPI.review(taskId, decision, feedback);
    await refreshPhases();
  }

  async function updateTaskDescription(taskId: string, desc: string) {
    await TaskAPI.updateDescription(taskId, desc);
    await refreshPhases();
  }

  const value = useMemo<AppContextValue>(
    () => ({
      userRole,
      toggleRole: () =>
        setUserRole((r) => (r === "mentee" ? "mentor" : "mentee")),

      totalXP,
      xpGoal,
      phases,
      loading,
      profileData,
      setProfileData,
      questionnaireAnswers,
      setQuestionnaireAnswers,

      addPhase,
      editPhase,
      deletePhase,

      addTaskToPhase,
      editTask,
      deleteTask,

      submitTask,
      addMockAttachment,
      reviewTask,
      updateTaskDescription,

      refreshPhases,
    }),
    [
      userRole,
      totalXP,
      xpGoal,
      phases,
      loading,
      profileData,
      questionnaireAnswers,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ---------------- hook ----------------

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
