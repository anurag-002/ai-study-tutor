import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserCircle, GraduationCap, Trophy, Clock, Target, BookOpen, Calculator, FlaskConical } from "lucide-react";

interface ProfileDialogProps {
  children: React.ReactNode;
}

// Mock user data - in a real app this would come from authentication/user service
const mockUserData = {
  name: "Demo Student",
  email: "demo@student.edu",
  avatar: "",
  level: "Intermediate",
  joinedDate: "September 2024",
  stats: {
    questionsAsked: 47,
    problemsSolved: 34,
    studyHours: 12.5,
    streak: 5
  },
  subjects: [
    { name: "Mathematics", progress: 78, icon: Calculator },
    { name: "Physics", progress: 65, icon: FlaskConical },
    { name: "Chemistry", progress: 45, icon: BookOpen }
  ],
  achievements: [
    { name: "First Question", description: "Asked your first question", earned: true },
    { name: "Problem Solver", description: "Solved 10 problems", earned: true },
    { name: "Study Streak", description: "5 days in a row", earned: true },
    { name: "Math Master", description: "Solved 50 math problems", earned: false },
    { name: "Science Explorer", description: "Asked questions in 3+ subjects", earned: false }
  ]
};

export function ProfileDialog({ children }: ProfileDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserCircle className="w-5 h-5 text-primary" />
            <span>Your Profile</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={mockUserData.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {mockUserData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{mockUserData.name}</h2>
                <p className="text-muted-foreground">{mockUserData.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">{mockUserData.level}</Badge>
                  <span className="text-sm text-muted-foreground">Joined {mockUserData.joinedDate}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Study Statistics */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Study Statistics</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{mockUserData.stats.questionsAsked}</div>
                <div className="text-xs text-muted-foreground">Questions Asked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{mockUserData.stats.problemsSolved}</div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{mockUserData.stats.studyHours}h</div>
                <div className="text-xs text-muted-foreground">Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{mockUserData.stats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </Card>

          {/* Subject Progress */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Subject Progress</h3>
            </div>
            
            <div className="space-y-4">
              {mockUserData.subjects.map((subject, index) => {
                const IconComponent = subject.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{subject.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-4 h-4 text-primary" />
              <h3 className="font-medium">Achievements</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockUserData.achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/50 border-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Trophy className={`w-4 h-4 ${
                      achievement.earned ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{achievement.name}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    {achievement.earned && (
                      <Badge variant="secondary" className="text-xs">✓</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="font-medium mb-1">🎯 Keep Learning!</p>
          <p className="text-xs">Your progress is automatically tracked. Keep asking questions and solving problems to level up!</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}