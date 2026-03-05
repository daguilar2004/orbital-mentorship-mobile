import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "habits" | "goals" | "discipline";

export default function Journey() {

  const [activeTab, setActiveTab] = useState<TabKey>("habits");

  const [selectedHabit, setSelectedHabit] = useState<number | null>(null);
  const [habitInput, setHabitInput] = useState("");

  const [habitAnswers, setHabitAnswers] = useState({
    trigger: "",
    motivation: "",
    action: "",
    reinforcement: "",
  });

  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [goalInput, setGoalInput] = useState("");

  const [goalAnswers, setGoalAnswers] = useState({
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "",
  });

  const [disciplineInput, setDisciplineInput] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState(false);
  const [disciplineAnswer, setDisciplineAnswer] = useState("");

  const saveHabit = (key: string) => {
    setHabitAnswers(prev => ({
      ...prev,
      [key]: habitInput
    }));
    setHabitInput("");
    setSelectedHabit(null);
  };

  const saveGoal = (key: string) => {
    setGoalAnswers(prev => ({
      ...prev,
      [key]: goalInput
    }));
    setGoalInput("");
    setSelectedGoal(null);
  };

  const saveDiscipline = () => {
    setDisciplineAnswer(disciplineInput);
    setDisciplineInput("");
    setSelectedDiscipline(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scrollBg} contentContainerStyle={styles.pagePad}>

        <Text style={styles.pageTitle}>My Journey</Text>
        <Text style={styles.pageSub}>Track your personal growth</Text>

        <View style={styles.tabRow}>
          <TabButton label="Habits" icon="♡" active={activeTab==="habits"} onPress={()=>setActiveTab("habits")} />
          <TabButton label="Goals" icon="◎" active={activeTab==="goals"} onPress={()=>setActiveTab("goals")} />
          <TabButton label="Discipline" icon="🏆" active={activeTab==="discipline"} onPress={()=>setActiveTab("discipline")} />
        </View>

        <View style={{height:16}}/>

{/* HABITS */}

{activeTab === "habits" && (
<View style={styles.card}>

<Text style={styles.cardTitle}>Habit Building</Text>

{/* Trigger */}
<Pressable onPress={()=>setSelectedHabit(1)}>
<Text style={styles.questionTitle}>1. Trigger</Text>
<Text style={styles.questionText}>
What situation, time, or event will remind you to practice this habit?
</Text>
</Pressable>

{habitAnswers.trigger !== "" &&
<Text style={styles.answerText}>{habitAnswers.trigger}</Text>
}

{selectedHabit === 1 &&
<View style={styles.inputRow}>
<TextInput
value={habitInput}
onChangeText={setHabitInput}
placeholder="Enter trigger..."
style={styles.input}
/>
<Pressable style={styles.addBtnPurple} onPress={()=>saveHabit("trigger")}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>
</View>
}

{/* Motivation */}
<Pressable onPress={()=>setSelectedHabit(2)}>
<Text style={styles.questionTitle}>2. Motivation</Text>
<Text style={styles.questionText}>
Why is practicing this habit important for the professional you want to become?
</Text>
</Pressable>

{habitAnswers.motivation !== "" &&
<Text style={styles.answerText}>{habitAnswers.motivation}</Text>
}

{selectedHabit === 2 &&
<View style={styles.inputRow}>
<TextInput
value={habitInput}
onChangeText={setHabitInput}
placeholder="Enter motivation..."
style={styles.input}
/>
<Pressable style={styles.addBtnPurple} onPress={()=>saveHabit("motivation")}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>
</View>
}

{/* Action */}
<Pressable onPress={()=>setSelectedHabit(3)}>
<Text style={styles.questionTitle}>3. Action</Text>
<Text style={styles.questionText}>
What exact action will you take when the trigger occurs?
</Text>
</Pressable>

{habitAnswers.action !== "" &&
<Text style={styles.answerText}>{habitAnswers.action}</Text>
}

{selectedHabit === 3 &&
<View style={styles.inputRow}>
<TextInput
value={habitInput}
onChangeText={setHabitInput}
placeholder="Enter action..."
style={styles.input}
/>
<Pressable style={styles.addBtnPurple} onPress={()=>saveHabit("action")}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>
</View>
}

{/* Reinforcement */}
<Pressable onPress={()=>setSelectedHabit(4)}>
<Text style={styles.questionTitle}>4. Reinforcement</Text>
<Text style={styles.questionText}>
How will you reinforce completing this habit so you're more likely to repeat it?
</Text>
</Pressable>

{habitAnswers.reinforcement !== "" &&
<Text style={styles.answerText}>{habitAnswers.reinforcement}</Text>
}

{selectedHabit === 4 &&
<View style={styles.inputRow}>
<TextInput
value={habitInput}
onChangeText={setHabitInput}
placeholder="Enter reinforcement..."
style={styles.input}
/>
<Pressable style={styles.addBtnPurple} onPress={()=>saveHabit("reinforcement")}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>
</View>
}

</View>
)}

{/* GOALS */}

{activeTab === "goals" && (
<View style={styles.card}>

<Text style={styles.cardTitle}>Weekly SMART Goal</Text>

{[
{num:1,key:"specific",q:"What specific action can you take this week that moves you closer to your goal?"},
{num:2,key:"measurable",q:"How will you know you made progress by the end of the week?"},
{num:3,key:"achievable",q:"Why is this goal realistic within the next 7 days?"},
{num:4,key:"relevant",q:"How does this goal support the professional you want to become?"},
{num:5,key:"timebound",q:"When will you work on or complete this goal in the next 7 days?"}
].map(item=>(
<View key={item.key}>

<Pressable onPress={()=>setSelectedGoal(item.num)}>
<Text style={styles.questionTitle}>{item.num}. {item.key.charAt(0).toUpperCase()+item.key.slice(1)}</Text>
<Text style={styles.questionText}>{item.q}</Text>
</Pressable>

{goalAnswers[item.key as keyof typeof goalAnswers] !== "" &&
<Text style={styles.answerText}>
{goalAnswers[item.key as keyof typeof goalAnswers]}
</Text>
}

{selectedGoal === item.num &&
<View style={styles.inputRow}>
<TextInput
value={goalInput}
onChangeText={setGoalInput}
placeholder="Enter your answer..."
style={styles.input}
/>
<Pressable style={styles.addBtnPurple} onPress={()=>saveGoal(item.key)}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>
</View>
}

</View>
))}

</View>
)}

{/* DISCIPLINE */}

{activeTab === "discipline" && (
<View style={styles.card}>

<Text style={styles.cardTitle}>Discipline</Text>

<Pressable onPress={()=>setSelectedDiscipline(true)}>
<Text style={styles.questionTitle}>
1. Daily Action
</Text>
<Text style={styles.questionText}>
What is the smallest thing you can do today to get you closer to your goal?
</Text>
</Pressable>

{disciplineAnswer !== "" &&
<Text style={styles.answerText}>{disciplineAnswer}</Text>
}

{selectedDiscipline &&
<View style={styles.inputRow}>
<TextInput
value={disciplineInput}
onChangeText={setDisciplineInput}
placeholder="Enter today's action..."
style={styles.input}
/>
<Pressable style={styles.addBtnPurple} onPress={saveDiscipline}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>
</View>
}

</View>
)}

</ScrollView>
</SafeAreaView>
);
}

function TabButton(props:{label:string;icon:string;active:boolean;onPress:()=>void}) {
return(
<Pressable onPress={props.onPress} style={styles.tabBtn}>
<Text style={[styles.tabLabel,props.active && styles.tabLabelActive]}>
{props.icon} {props.label}
</Text>
</Pressable>
);
}

const styles = StyleSheet.create({

safe:{flex:1,backgroundColor:"#FFFFFF"},
scrollBg:{flex:1,backgroundColor:"#FFFFFF"},
pagePad:{padding:16,paddingBottom:30},

pageTitle:{fontSize:26,fontWeight:"900",color:"#111827"},
pageSub:{marginTop:4,fontSize:13,color:"#6B7280"},

tabRow:{marginTop:18,flexDirection:"row",justifyContent:"space-around"},
tabBtn:{paddingVertical:8},

tabLabel:{fontSize:14,color:"#9CA3AF",fontWeight:"700"},
tabLabelActive:{color:"#7C3AED"},

card:{
backgroundColor:"#FFFFFF",
borderRadius:16,
padding:14,
borderWidth:1,
borderColor:"#E5E7EB",
},

cardTitle:{fontSize:14,fontWeight:"900",color:"#111827"},

questionTitle:{fontSize:14,fontWeight:"900",marginTop:14},

questionText:{fontSize:13,color:"#6B7280",marginTop:4},

answerText:{
marginTop:6,
marginLeft:10,
fontSize:13,
color:"#111827",
},

inputRow:{
marginTop:10,
flexDirection:"row",
alignItems:"center",
gap:10,
},

input:{
flex:1,
height:42,
borderRadius:12,
borderWidth:1,
borderColor:"#E5E7EB",
paddingHorizontal:12,
},

addBtnPurple:{
width:46,
height:46,
borderRadius:14,
backgroundColor:"#7C3AED",
alignItems:"center",
justifyContent:"center",
},

addBtnText:{
color:"#FFFFFF",
fontSize:22,
fontWeight:"900",
}

});
