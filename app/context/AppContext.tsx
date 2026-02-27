import React, { createContext, useContext, useMemo, useState } from "react";

export type UserRole = "mentee" | "mentor";

export type TaskStatus = "pending" | "submitted" | "approved" | "rejected";
export type PhaseStatus = "current" | "completed" | "upcoming";

export type Task = { status: TaskStatus };
export type Phase = {
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
  setUserRole: (role: UserRole) => void;
  toggleRole: () => void;

  totalXP: number;
  phases: Phase[];

  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;

  questionnaireAnswers: QuestionnaireAnswers;
  setQuestionnaireAnswers: (answers: QuestionnaireAnswers) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("mentee");

  // Mock data for now (replace later with real data/API)
  const [totalXP] = useState<number>(1240);
  const [phases] = useState<Phase[]>([
    {
      name: "Phase 2: Foundations",
      status: "current",
      startDate: "Feb 1",
      endDate: "Mar 1",
      tasks: [
        { status: "approved" },
        { status: "approved" },
        { status: "pending" },
        { status: "submitted" },
      ],
    },
    {
      name: "Phase 1: Onboarding",
      status: "completed",
      startDate: "Jan 1",
      endDate: "Jan 31",
      tasks: [{ status: "approved" }],
    },
  ]);

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

  const value = useMemo<AppContextValue>(() => {
    return {
      userRole,
      setUserRole,
      toggleRole: () =>
        setUserRole((r) => (r === "mentee" ? "mentor" : "mentee")),
      totalXP,
      phases,
      profileData,
      setProfileData,
      questionnaireAnswers,
      setQuestionnaireAnswers,
    };
  }, [userRole, totalXP, phases, profileData, questionnaireAnswers]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
