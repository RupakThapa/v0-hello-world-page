"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Save, Plus, Trash2, Shield, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SettingsPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true)
  const [replyDelay, setReplyDelay] = useState("2")
  const [businessName, setBusinessName] = useState("Acme Restaurant")
  const [brandVoice, setBrandVoice] = useState("friendly")
  const [customPrompt, setCustomPrompt] = useState("")
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Standard Thank You",
      content: "Thank you so much for your wonderful review! We're thrilled to hear you had a great experience.",
    },
    {
      id: 2,
      name: "Food Compliment",
      content: "We're delighted you enjoyed our food! Your kind words mean the world to our kitchen team.",
    },
  ])

  const handleSaveSettings = () => {
    // Save settings logic
    console.log("Settings saved")
  }

  const addTemplate = () => {
    const newTemplate = {
      id: templates.length + 1,
      name: "New Template",
      content: "",
    }
    setTemplates([...templates, newTemplate])
  }

  const deleteTemplate = (id: number) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your auto-reply system and brand preferences</p>
      </div>

      <Tabs defaultValue="automation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="brand">Brand Voice</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Auto-Reply Settings
              </CardTitle>
              <CardDescription>Configure when and how the system automatically responds to reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Auto-Reply</Label>
                  <p className="text-sm text-muted-foreground">Automatically reply to 5-star reviews only</p>
                </div>
                <Switch checked={autoReplyEnabled} onCheckedChange={setAutoReplyEnabled} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="reply-delay">Reply Delay (hours)</Label>
                <Select value={replyDelay} onValueChange={setReplyDelay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">30 minutes</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">How long to wait before sending auto-replies</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-hours">Business Hours</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Start Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                  <div>
                    <Label className="text-sm">End Time</Label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Only send replies during business hours</p>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  The system will never auto-reply to reviews with 1-4 stars. These require manual attention.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Voice & Messaging</CardTitle>
              <CardDescription>Define how your business should sound in auto-generated replies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your business name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-voice">Brand Voice</Label>
                <Select value={brandVoice} onValueChange={setBrandVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom AI Instructions</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Additional instructions for the AI to follow when generating replies..."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Provide specific guidance for how replies should be crafted
                </p>
              </div>

              <div className="space-y-2">
                <Label>Key Values to Emphasize</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Quality Service</Badge>
                  <Badge variant="secondary">Customer Satisfaction</Badge>
                  <Badge variant="secondary">Team Appreciation</Badge>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Value
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reply Templates</CardTitle>
              <CardDescription>Pre-written templates that the AI can use as inspiration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Input
                      value={template.name}
                      onChange={(e) => {
                        setTemplates(templates.map((t) => (t.id === template.id ? { ...t, name: e.target.value } : t)))
                      }}
                      className="font-medium"
                    />
                    <Button variant="ghost" size="sm" onClick={() => deleteTemplate(template.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={template.content}
                    onChange={(e) => {
                      setTemplates(templates.map((t) => (t.id === template.id ? { ...t, content: e.target.value } : t)))
                    }}
                    rows={3}
                  />
                </div>
              ))}

              <Button onClick={addTemplate} variant="outline" className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety & Approval Controls
              </CardTitle>
              <CardDescription>Configure safety measures and approval workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Manual Approval</Label>
                  <p className="text-sm text-muted-foreground">All replies must be approved before publishing</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Content Filtering</Label>
                  <p className="text-sm text-muted-foreground">Block inappropriate or off-brand responses</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Blocked Keywords</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="destructive">competitor names</Badge>
                  <Badge variant="destructive">pricing</Badge>
                  <Badge variant="destructive">personal info</Badge>
                </div>
                <Input placeholder="Add blocked keywords..." />
              </div>

              <div className="space-y-2">
                <Label>Daily Reply Limit</Label>
                <Input type="number" defaultValue="50" />
                <p className="text-sm text-muted-foreground">Maximum number of auto-replies per day</p>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  All safety measures are enabled by default. The system prioritizes brand protection over automation
                  speed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
