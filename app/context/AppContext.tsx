///////////////////////////////CURRENT CONTEXT FOR TESTING, WILL BE REPLACED WITH ORBITAL CONTEXT////////////////////////////

import React, { createContext, useContext, useMemo, useState } from "react";

export type UserRole = "mentee" | "mentor";

export type TaskStatus =
  | "pending" // not submitted yet
  | "submitted" // mentee submitted, waiting mentor review
  | "approved"
  | "rejected";

export type PhaseStatus = "current" | "completed" | "upcoming";

export type Attachment = {
  id: string;
  name: string;
  sizeLabel: string; // e.g. "500.0 KB"
};

export type Task = {
  id: string;
  title: string;
  description: string;
  xp: number;
  dueDate: string;

  // New fields for detailed task requirements
  expectedTime?: {
    value: number;
    unit: "hours" | "days" | "weeks";
  };
  skills?: string[];
  resources?: {
    type: "link" | "file";
    value: string;
    label?: string;
    fileInfo?: {
      name: string;
      size: number;
      uri: string;
      mimeType?: string;
    };
  }[];

  // submission
  status: TaskStatus;
  submittedResponse?: string;
  submittedAt?: string; // e.g. "2024-02-12"
  attachments?: Attachment[];

  // mentor review
  mentorFeedback?: string;
  reviewedAt?: string;
};

export type Phase = {
  id: string;
  name: string;
  status: PhaseStatus;
  startDate: string;
  endDate: string;
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

export interface QuestionnaireAnswers {
  mentoringComfort: number;
  industry: string;
  mentorIndustry: string;
  mentorSkillset: string;
  developmentGoal: string;
  holdingBack: string;
}

type AppContextValue = {
  userRole: UserRole;
  toggleRole: () => void;

  totalXP: number;
  xpGoal: number; // for progress bar
  phases: Phase[];
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;

  questionnaireAnswers: QuestionnaireAnswers;
  setQuestionnaireAnswers: (data: QuestionnaireAnswers) => void;

  // mentee/editor actions
  addPhase: (name: string, startDate: string, endDate: string) => void;
  editPhase: (
    phaseId: string,
    name: string,
    startDate: string,
    endDate: string,
  ) => void;
  deletePhase: (phaseId: string) => void;
  addTaskToPhase: (
    phaseId: string,
    title: string,
    dueDate?: string,
    expectedTime?: { value: number; unit: "hours" | "days" | "weeks" },
    skills?: string[],
    resources?: { type: "link" | "file"; value: string; label?: string }[],
  ) => void;
  editTask: (
    phaseId: string,
    taskId: string,
    title: string,
    dueDate: string,
    expectedTime?: { value: number; unit: "hours" | "days" | "weeks" },
    skills?: string[],
    resources?: { type: "link" | "file"; value: string; label?: string }[],
  ) => void;
  deleteTask: (phaseId: string, taskId: string) => void;

  // mentee actions
  submitTask: (phaseId: string, taskId: string, response: string) => void;
  addMockAttachment: (phaseId: string, taskId: string) => void;

  // mentor actions
  updateTaskDescription: (
    phaseId: string,
    taskId: string,
    desc: string,
  ) => void;
  reviewTask: (
    phaseId: string,
    taskId: string,
    decision: "approved" | "rejected",
    feedback: string,
  ) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function recomputePhaseStatuses(phases: Phase[]): Phase[] {
  // Rule: phases are linear. The first phase that is NOT fully approved is "current".
  // All prior phases become "completed". All later phases become "upcoming".
  const isPhaseComplete = (p: Phase) =>
    p.tasks.length > 0 && p.tasks.every((t) => t.status === "approved");

  const firstIncompleteIndex = phases.findIndex((p) => !isPhaseComplete(p));

  // If all are complete, keep them all completed.
  if (firstIncompleteIndex === -1) {
    return phases.map((p) => ({ ...p, status: "completed" as const }));
  }

  return phases.map((p, idx) => {
    if (idx < firstIncompleteIndex)
      return { ...p, status: "completed" as const };
    if (idx === firstIncompleteIndex)
      return { ...p, status: "current" as const };
    return { ...p, status: "upcoming" as const };
  });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("mentee");
  const xpGoal = 2000; // goal for progress bar
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

  // Mock data (replace later with API)
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: "p1",
      name: "Foundation",
      status: "completed",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      tasks: [
        {
          id: "t1",
          title: "Intro & Setup",
          description:
            "Complete onboarding and set up your tools. Include screenshots of your environment.",
          xp: 100,
          dueDate: "2024-01-10",
          status: "approved",
          submittedResponse: "Setup completed and verified.",
          submittedAt: "2024-01-09",
          attachments: [{ id: "a1", name: "setup.png", sizeLabel: "316.4 KB" }],
          mentorFeedback: "Looks good.",
          reviewedAt: "2024-01-10",
        },
      ],
    },
    {
      id: "p2",
      name: "Intermediate Skills",
      status: "current",
      startDate: "2024-02-01",
      endDate: "2024-02-28",
      tasks: [
        {
          id: "t2",
          title: "Project Planning",
          description:
            "Create a detailed project plan with milestones, deliverables, and timeline. Include risk assessment and resource allocation.",
          xp: 150,
          dueDate: "2024-02-15",
          status: "submitted",
          submittedResponse:
            "I have created a comprehensive project plan covering all major milestones. The plan includes weekly checkpoints and clear deliverables for each phase.",
          submittedAt: "2024-02-12",
          attachments: [
            { id: "a2", name: "project-plan.docx", sizeLabel: "500.0 KB" },
            { id: "a3", name: "timeline.png", sizeLabel: "316.4 KB" },
          ],
        },
        {
          id: "t3",
          title: "Implementation Phase 1",
          description:
            "Build the first working version of the feature set and record a short demo.",
          xp: 200,
          dueDate: "2024-02-25",
          status: "pending",
        },
      ],
    },
    {
      id: "p3",
      name: "Completion",
      status: "upcoming",
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      tasks: [
        {
          id: "t1",
          title: "xxx",
          description:
            "Complete onboarding and set up your tools. Include screenshots of your environment.",
          xp: 100,
          dueDate: "2024-01-10",
          status: "pending",
          submittedResponse: "Setup completed and verified.",
          submittedAt: "2024-01-09",
          attachments: [{ id: "a1", name: "setup.png", sizeLabel: "316.4 KB" }],
          mentorFeedback: "Looks good.",
          reviewedAt: "2024-01-10",
        },
      ],
    },
  ]);

  const totalXP = useMemo(() => {
    return phases
      .flatMap((p) => p.tasks)
      .filter((t) => t.status === "approved")
      .reduce((sum, t) => sum + t.xp, 0);
  }, [phases]);

  // ----------- actions (local state updates) -----------

  function submitTask(phaseId: string, taskId: string, response: string) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id !== taskId
                  ? t
                  : {
                      ...t,
                      status: "submitted",
                      submittedResponse: response,
                      submittedAt: todayISO(),
                    },
              ),
            },
      ),
    );
  }

  function addMockAttachment(phaseId: string, taskId: string) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) => {
                if (t.id !== taskId) return t;
                const next: Attachment = {
                  id: `a-${Math.random().toString(16).slice(2)}`,
                  name: `attachment-${(t.attachments?.length ?? 0) + 1}.pdf`,
                  sizeLabel: "120.0 KB",
                };
                return { ...t, attachments: [...(t.attachments ?? []), next] };
              }),
            },
      ),
    );
  }

  function updateTaskDescription(
    phaseId: string,
    taskId: string,
    desc: string,
  ) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id !== taskId ? t : { ...t, description: desc },
              ),
            },
      ),
    );
  }

  function reviewTask(
    phaseId: string,
    taskId: string,
    decision: "approved" | "rejected",
    feedback: string,
  ) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id !== taskId
                  ? t
                  : {
                      ...t,
                      status: decision,
                      mentorFeedback: feedback,
                      reviewedAt: todayISO(),
                    },
              ),
            },
      ),
    );
  }

  function addPhase(name: string, startDate: string, endDate: string) {
    const newPhase: Phase = {
      id: `p-${Math.random().toString(16).slice(2)}`,
      name,
      status: "upcoming",
      startDate,
      endDate,
      tasks: [],
    };
    setPhases((prev) => [...prev, newPhase]);
  }

  function addTaskToPhase(
    phaseId: string,
    title: string,
    dueDate?: string,
    expectedTime?: { value: number; unit: "hours" | "days" | "weeks" },
    skills?: string[],
    resources?: { type: "link" | "file"; value: string; label?: string }[],
  ) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: [
                ...p.tasks,
                {
                  id: `t-${Math.random().toString(16).slice(2)}`,
                  title,
                  description: "",
                  xp: 100,
                  dueDate: dueDate || new Date().toISOString().split("T")[0],
                  expectedTime,
                  skills,
                  resources,
                  status: "pending",
                } as Task,
              ],
            },
      ),
    );
  }

  function editPhase(
    phaseId: string,
    name: string,
    startDate: string,
    endDate: string,
  ) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              name,
              startDate,
              endDate,
            },
      ),
    );
  }

  function deletePhase(phaseId: string) {
    setPhases((prev) => prev.filter((p) => p.id !== phaseId));
  }

  function editTask(
    phaseId: string,
    taskId: string,
    title: string,
    dueDate: string,
    expectedTime?: { value: number; unit: "hours" | "days" | "weeks" },
    skills?: string[],
    resources?: { type: "link" | "file"; value: string; label?: string }[],
  ) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id !== taskId
                  ? t
                  : {
                      ...t,
                      title,
                      dueDate,
                      expectedTime,
                      skills,
                      resources,
                    },
              ),
            },
      ),
    );
  }

  function deleteTask(phaseId: string, taskId: string) {
    setPhases((prev) =>
      prev.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              tasks: p.tasks.filter((t) => t.id !== taskId),
            },
      ),
    );
  }

  const value = useMemo<AppContextValue>(() => {
    return {
      userRole,
      toggleRole: () =>
        setUserRole((r) => (r === "mentee" ? "mentor" : "mentee")),

      totalXP,
      xpGoal,
      phases: recomputePhaseStatuses(phases),

      // ✅ ADD THESE
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
      updateTaskDescription,
      reviewTask,
    };
  }, [userRole, totalXP, xpGoal, phases, profileData, questionnaireAnswers]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
