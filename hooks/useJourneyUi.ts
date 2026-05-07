import { useEffect, useState } from "react";

import { TabKey } from "../types/accountability";

export function useJourneyUi() {
  const [introDone, setIntroDone] = useState(false);
  const [reflection, setReflection] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const [showGoalsHelp, setShowGoalsHelp] = useState(false);
  const [hasSeenGoalsHelp, setHasSeenGoalsHelp] = useState(false);

  useEffect(() => {
    if (activeTab === "goals" && !hasSeenGoalsHelp) {
      setShowGoalsHelp(true);
      setHasSeenGoalsHelp(true);
    }
  }, [activeTab, hasSeenGoalsHelp]);

  const beginJourney = () => {
    setIntroDone(true);
  };

  const skipJourneyIntro = () => {
    setIntroDone(true);
  };

  return {
    introDone,
    reflection,
    setReflection,
    activeTab,
    setActiveTab,
    showGoalsHelp,
    setShowGoalsHelp,
    beginJourney,
    skipJourneyIntro,
  };
}
