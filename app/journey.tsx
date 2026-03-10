import { useState } from "react";
import {
Pressable,
ScrollView,
StyleSheet,
Text,
TextInput,
View,
Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabKey = "habits" | "goals" | "discipline";

type Habit = {
id:string
title:string
answers:{
trigger:string
motivation:string
action:string
reinforcement:string
reflection:string
}
}

type Goal = {
id:string
title:string
answers:{
specific:string
measurable:string
achievable:string
relevant:string
timebound:string
}
}

export default function Journey(){

const [introDone,setIntroDone] = useState(false)
const [reflection,setReflection] = useState("")

const [activeTab,setActiveTab] = useState<TabKey>("habits")

const [habits,setHabits] = useState<Habit[]>([])
const [goals,setGoals] = useState<Goal[]>([])

const [openHabit,setOpenHabit] = useState<string | null>(null)
const [openGoal,setOpenGoal] = useState<string | null>(null)

const [selectedHabit,setSelectedHabit] = useState<string | null>(null)
const [selectedHabitQuestion,setSelectedHabitQuestion] = useState<string | null>(null)

const [selectedGoal,setSelectedGoal] = useState<string | null>(null)
const [selectedGoalQuestion,setSelectedGoalQuestion] = useState<string | null>(null)

const [input,setInput] = useState("")

const [addingHabit,setAddingHabit] = useState(false)
const [addingGoal,setAddingGoal] = useState(false)

const [newHabitTitle,setNewHabitTitle] = useState("")
const [newGoalTitle,setNewGoalTitle] = useState("")

const [discipline,setDiscipline] = useState("")

/* ADD HABIT */

const addHabit = () => {

if(newHabitTitle.trim()==="") return

setHabits(prev => [
...prev,
{
id:Date.now().toString(),
title:newHabitTitle,
answers:{
trigger:"",
motivation:"",
action:"",
reinforcement:"",
reflection:""
}
}
])

setNewHabitTitle("")
setAddingHabit(false)

}

/* ADD GOAL */

const addGoal = () => {

if(newGoalTitle.trim()==="") return

setGoals(prev => [
...prev,
{
id:Date.now().toString(),
title:newGoalTitle,
answers:{
specific:"",
measurable:"",
achievable:"",
relevant:"",
timebound:""
}
}
])

setNewGoalTitle("")
setAddingGoal(false)

}

/* DELETE HABIT */

const deleteHabit = (habitId:string)=>{

Alert.alert(
"Delete this habit?",
"",
[
{ text:"No", style:"cancel" },
{
text:"Yes",
onPress:()=>{
setHabits(prev => prev.filter(h => h.id !== habitId))

if(openHabit === habitId){
setOpenHabit(null)
}
}
}
]
)

}

/* DELETE GOAL */

const deleteGoal = (goalId:string)=>{

Alert.alert(
"Delete this goal?",
"",
[
{ text:"No", style:"cancel" },
{
text:"Yes",
onPress:()=>{
setGoals(prev => prev.filter(g => g.id !== goalId))

if(openGoal === goalId){
setOpenGoal(null)
}
}
}
]
)

}

/* SAVE HABIT ANSWER */

const saveHabitAnswer=(habitId:string,key:string)=>{

setHabits(prev =>
prev.map(h =>
h.id === habitId
? {...h,answers:{...h.answers,[key]:input}}
: h
)
)

setInput("")
setSelectedHabit(null)
setSelectedHabitQuestion(null)

}

/* SAVE GOAL ANSWER */

const saveGoalAnswer=(goalId:string,key:string)=>{

setGoals(prev =>
prev.map(g =>
g.id === goalId
? {...g,answers:{...g.answers,[key]:input}}
: g
)
)

setInput("")
setSelectedGoal(null)
setSelectedGoalQuestion(null)

}

return(
<SafeAreaView style={styles.safe}>

{!introDone ? (

<WelcomeScreen
reflection={reflection}
setReflection={setReflection}
onBegin={()=>setIntroDone(true)}
onSkip={()=>setIntroDone(true)}
/>

):( 

<View style={{flex:1}}>

<ScrollView style={styles.scrollBg} contentContainerStyle={styles.pagePad}>

<Text style={styles.pageTitle}>My Journey</Text>

<View style={styles.tabRow}>

<TabButton label="Habits" active={activeTab==="habits"} onPress={()=>setActiveTab("habits")} />

<TabButton label="Goals" active={activeTab==="goals"} onPress={()=>setActiveTab("goals")} />

<TabButton label="Discipline" active={activeTab==="discipline"} onPress={()=>setActiveTab("discipline")} />

</View>

{/* HABIT NAME INPUT */}

{addingHabit && activeTab==="habits" && (

<View style={styles.card}>

<Text style={styles.cardTitle}>Name Your Habit</Text>

<TextInput
value={newHabitTitle}
onChangeText={setNewHabitTitle}
placeholder="Example: Read 10 pages"
style={styles.input}
/>

<Pressable style={styles.addBtnPurple} onPress={addHabit}>
<Text style={styles.addBtnText}>Create</Text>
</Pressable>

</View>

)}

{/* GOAL NAME INPUT */}

{addingGoal && activeTab==="goals" && (

<View style={styles.card}>

<Text style={styles.cardTitle}>Name Your Goal</Text>

<TextInput
value={newGoalTitle}
onChangeText={setNewGoalTitle}
placeholder="Example: Finish OS project"
style={styles.input}
/>

<Pressable style={styles.addBtnPurple} onPress={addGoal}>
<Text style={styles.addBtnText}>Create</Text>
</Pressable>

</View>

)}

{/* HABITS */}

{activeTab==="habits" && habits.map(habit=>{

const questions=[
{key:"trigger",title:"Trigger",text:"What reminds you to do this habit?"},
{key:"motivation",title:"Motivation",text:"Why is this habit important?"},
{key:"action",title:"Action",text:"What action will you take?"},
{key:"reinforcement",title:"Reinforcement",text:"How will you reinforce the habit?"},
{key:"reflection",title:"Reflection",text:"How does this help your growth?"}
]

return(

<View key={habit.id} style={styles.card}>

<Pressable
onPress={()=>setOpenHabit(openHabit===habit.id?null:habit.id)}
onLongPress={()=>deleteHabit(habit.id)}
delayLongPress={500}
>

<Text style={styles.cardTitle}>
{habit.title} {openHabit===habit.id?"▲":"▼"}
</Text>

</Pressable>

{openHabit===habit.id && questions.map(q=>{

const value = habit.answers[q.key as keyof typeof habit.answers]

return(

<View key={q.key}>

<Pressable
onPress={()=>{
setSelectedHabit(habit.id)
setSelectedHabitQuestion(q.key)
}}
>

<Text style={styles.questionTitle}>{q.title}</Text>
<Text style={styles.questionText}>{q.text}</Text>

</Pressable>

{value!=="" && <Text style={styles.answerText}>{value}</Text>}

{selectedHabit===habit.id && selectedHabitQuestion===q.key && (

<View style={styles.inputRow}>

<TextInput
value={input}
onChangeText={setInput}
placeholder="Enter answer..."
style={styles.input}
/>

<Pressable style={styles.addBtnPurple} onPress={()=>saveHabitAnswer(habit.id,q.key)}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>

</View>

)}

</View>

)

})}

</View>

)

})}

{/* GOALS */}

{activeTab==="goals" && goals.map(goal=>{

const questions=[
{key:"specific",title:"Specific",text:"What action moves you toward your goal?"},
{key:"measurable",title:"Measurable",text:"How will you measure progress?"},
{key:"achievable",title:"Achievable",text:"Why is this realistic?"},
{key:"relevant",title:"Relevant",text:"Why does this matter to you?"},
{key:"timebound",title:"Time Bound",text:"When will it be completed?"}
]

return(

<View key={goal.id} style={styles.card}>

<Pressable
onPress={()=>setOpenGoal(openGoal===goal.id?null:goal.id)}
onLongPress={()=>deleteGoal(goal.id)}
delayLongPress={500}
>

<Text style={styles.cardTitle}>
{goal.title} {openGoal===goal.id?"▲":"▼"}
</Text>

</Pressable>

{openGoal===goal.id && questions.map(q=>{

const value = goal.answers[q.key as keyof typeof goal.answers]

return(

<View key={q.key}>

<Pressable
onPress={()=>{
setSelectedGoal(goal.id)
setSelectedGoalQuestion(q.key)
}}
>

<Text style={styles.questionTitle}>{q.title}</Text>
<Text style={styles.questionText}>{q.text}</Text>

</Pressable>

{value!=="" && <Text style={styles.answerText}>{value}</Text>}

{selectedGoal===goal.id && selectedGoalQuestion===q.key && (

<View style={styles.inputRow}>

<TextInput
value={input}
onChangeText={setInput}
placeholder="Enter answer..."
style={styles.input}
/>

<Pressable style={styles.addBtnPurple} onPress={()=>saveGoalAnswer(goal.id,q.key)}>
<Text style={styles.addBtnText}>＋</Text>
</Pressable>

</View>

)}

</View>

)

})}

</View>

)

})}

{/* DISCIPLINE */}

{activeTab==="discipline" && (

<View style={styles.card}>

<Text style={styles.cardTitle}>
What is the smallest thing you can do today to get closer to your goal?
</Text>

<TextInput
value={discipline}
onChangeText={setDiscipline}
multiline
style={styles.bigInput}
/>

</View>

)}

</ScrollView>

{/* FLOATING BUTTON */}

{activeTab==="habits" && (
<Pressable style={styles.fab} onPress={()=>setAddingHabit(true)}>
<Text style={styles.fabText}>＋</Text>
</Pressable>
)}

{activeTab==="goals" && (
<Pressable style={styles.fab} onPress={()=>setAddingGoal(true)}>
<Text style={styles.fabText}>＋</Text>
</Pressable>
)}

</View>

)}

</SafeAreaView>
)
}

function WelcomeScreen(props:any){

return(

<ScrollView style={styles.scrollBg} contentContainerStyle={styles.centerWrap}>

<View style={styles.welcomeCard}>

<Text style={styles.welcomeTitle}>Welcome to Your Journey</Text>

<Text style={styles.welcomeSub}>
Reflect on who you are today and who you want to become.
</Text>

<TextInput
value={props.reflection}
onChangeText={props.setReflection}
placeholder="Share your thoughts..."
multiline
style={styles.textArea}
/>

<Pressable style={styles.primaryBtn} onPress={props.onBegin}>
<Text style={styles.primaryBtnText}>Begin Journey</Text>
</Pressable>

<Pressable onPress={props.onSkip}>
<Text style={styles.skipText}>Skip</Text>
</Pressable>

</View>

</ScrollView>

)

}

function TabButton(props:any){

return(
<Pressable onPress={props.onPress}>
<Text style={[styles.tabLabel,props.active && styles.tabLabelActive]}>
{props.label}
</Text>
</Pressable>
)

}

const styles = StyleSheet.create({

safe:{flex:1,backgroundColor:"#FFF"},
scrollBg:{flex:1,backgroundColor:"#FFF"},
pagePad:{padding:16},

pageTitle:{fontSize:26,fontWeight:"900"},

tabRow:{flexDirection:"row",justifyContent:"space-around",marginTop:20},

tabLabel:{fontSize:14,color:"#9CA3AF",fontWeight:"700"},
tabLabelActive:{color:"#7C3AED"},

card:{marginTop:20,padding:16,borderRadius:16,borderWidth:1,borderColor:"#E5E7EB"},

cardTitle:{fontSize:16,fontWeight:"900"},

questionTitle:{fontSize:14,fontWeight:"900",marginTop:14},

questionText:{fontSize:13,color:"#6B7280",marginTop:4},

answerText:{marginTop:6,marginLeft:10,fontSize:13},

inputRow:{marginTop:10,flexDirection:"row",alignItems:"center"},

input:{flex:1,height:42,borderRadius:12,borderWidth:1,borderColor:"#E5E7EB",paddingHorizontal:12},

bigInput:{marginTop:12,minHeight:120,borderWidth:1,borderColor:"#E5E7EB",borderRadius:12,padding:10},

addBtnPurple:{marginTop:10,height:42,borderRadius:12,backgroundColor:"#7C3AED",alignItems:"center",justifyContent:"center"},

addBtnText:{color:"#FFF",fontWeight:"900"},

fab:{position:"absolute",bottom:30,right:25,width:60,height:60,borderRadius:30,backgroundColor:"#7C3AED",alignItems:"center",justifyContent:"center"},

fabText:{color:"#FFF",fontSize:30,fontWeight:"bold"},

centerWrap:{padding:18,flexGrow:1,justifyContent:"center"},

welcomeCard:{backgroundColor:"#FFF",borderRadius:22,padding:20,borderWidth:1,borderColor:"#F1F5F9"},

welcomeTitle:{fontSize:24,fontWeight:"800",textAlign:"center"},

welcomeSub:{marginTop:8,fontSize:13,color:"#6B7280",textAlign:"center"},

textArea:{marginTop:14,minHeight:120,borderRadius:14,borderWidth:1,borderColor:"#E5E7EB",padding:12},

primaryBtn:{marginTop:16,height:52,borderRadius:16,backgroundColor:"#EC4899",alignItems:"center",justifyContent:"center"},

primaryBtnText:{color:"#FFF",fontWeight:"800"},

skipText:{textAlign:"center",marginTop:10,color:"#6B7280"}

})