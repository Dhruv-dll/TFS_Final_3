import { motion } from "framer-motion";
import { Users, Plus } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLuminariesData, TeamMember as LuminaryMember } from "../hooks/useLuminariesData";

export default function AdminLuminariesPanel() {
  const { faculty, leadership, addMember, updateMember, removeMember } = useLuminariesData();

  const [newLuminary, setNewLuminary] = useState<LuminaryMember>({
    id: "",
    name: "",
    title: "",
    bio: "",
    image: "",
    email: "",
    linkedin: "",
    achievements: [],
    expertise: [],
    quote: "",
  });
  const [luminaryGroup, setLuminaryGroup] = useState<"faculty" | "leadership">("faculty");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (newLuminary.name.trim() && newLuminary.title.trim() && newLuminary.email.trim()) {
      const payload: LuminaryMember = {
        ...newLuminary,
        id: newLuminary.id || `${luminaryGroup}-${Date.now()}`,
        achievements: Array.isArray(newLuminary.achievements)
          ? newLuminary.achievements
          : String(newLuminary.achievements || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        expertise: Array.isArray(newLuminary.expertise)
          ? newLuminary.expertise
          : String(newLuminary.expertise || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
      } as LuminaryMember;

      if (editingId) {
        updateMember(luminaryGroup, editingId, payload);
        alert("Luminary updated successfully!");
      } else {
        addMember(luminaryGroup, payload);
        alert("Luminary added successfully!");
      }

      setNewLuminary({
        id: "",
        name: "",
        title: "",
        bio: "",
        image: "",
        email: "",
        linkedin: "",
        achievements: [],
        expertise: [],
        quote: "",
      });
      setEditingId(null);
    } else {
      alert("Please fill in Name, Title, and Email before adding a luminary.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-finance-gold/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-finance-gold" />
          <h3 className="text-xl font-bold text-finance-gold">Manage Luminaries</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm text-finance-gold">Group</label>
            <select
              value={luminaryGroup}
              onChange={(e) => setLuminaryGroup(e.target.value as "faculty" | "leadership")}
              className="bg-finance-navy/50 border border-finance-gold/20 rounded-lg px-3 py-2 text-sm"
            >
              <option value="faculty">Faculty</option>
              <option value="leadership">Student Leadership</option>
            </select>
          </div>
          <Input
            placeholder="Photo URL"
            value={newLuminary.image}
            onChange={(e) => setNewLuminary((p) => ({ ...p, image: e.target.value }))}
            className="bg-finance-navy/50 border-finance-gold/20"
          />
          <Input
            placeholder="Full Name"
            value={newLuminary.name}
            onChange={(e) => setNewLuminary((p) => ({ ...p, name: e.target.value }))}
            className="bg-finance-navy/50 border-finance-gold/20"
          />
          <Input
            placeholder="Title / Role"
            value={newLuminary.title}
            onChange={(e) => setNewLuminary((p) => ({ ...p, title: e.target.value }))}
            className="bg-finance-navy/50 border-finance-gold/20"
          />
          <Input
            placeholder="Email"
            value={newLuminary.email}
            onChange={(e) => setNewLuminary((p) => ({ ...p, email: e.target.value }))}
            className="bg-finance-navy/50 border-finance-gold/20"
          />
          <Input
            placeholder="LinkedIn (username or URL)"
            value={newLuminary.linkedin || ""}
            onChange={(e) => setNewLuminary((p) => ({ ...p, linkedin: e.target.value }))}
            className="bg-finance-navy/50 border-finance-gold/20"
          />
          <div className="md:col-span-2 grid grid-cols-1 gap-3">
            <Input
              placeholder="Short Bio"
              value={newLuminary.bio}
              onChange={(e) => setNewLuminary((p) => ({ ...p, bio: e.target.value }))}
              className="bg-finance-navy/50 border-finance-gold/20"
            />
            <Input
              placeholder="Quote"
              value={newLuminary.quote}
              onChange={(e) => setNewLuminary((p) => ({ ...p, quote: e.target.value }))}
              className="bg-finance-navy/50 border-finance-gold/20"
            />
            <Input
              placeholder="Achievements (comma separated)"
              value={Array.isArray(newLuminary.achievements) ? newLuminary.achievements.join(", ") : (newLuminary.achievements as unknown as string)}
              onChange={(e) => setNewLuminary((p) => ({ ...p, achievements: e.target.value }))}
              className="bg-finance-navy/50 border-finance-gold/20"
            />
            <Input
              placeholder="Expertise (comma separated)"
              value={Array.isArray(newLuminary.expertise) ? newLuminary.expertise.join(", ") : (newLuminary.expertise as unknown as string)}
              onChange={(e) => setNewLuminary((p) => ({ ...p, expertise: e.target.value }))}
              className="bg-finance-navy/50 border-finance-gold/20"
            />
            <Button
              onClick={handleAdd}
              disabled={!newLuminary.name.trim() || !newLuminary.title.trim() || !newLuminary.email.trim()}
              title={!newLuminary.name.trim() || !newLuminary.title.trim() || !newLuminary.email.trim() ? "Fill Name, Title, and Email to enable" : undefined}
              className="bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform w-fit"
            >
              <Plus className="w-4 h-4 mr-2" /> {editingId ? "Save Changes" : "Add Luminary"}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-finance-teal/20"
      >
        <h4 className="text-lg font-semibold text-finance-teal mb-4">All Luminaries</h4>
        <div className="space-y-4">
          {( ["faculty", "leadership"] as const).map((groupKey) => (
            <div key={groupKey}>
              <div className="text-sm font-semibold text-finance-gold mb-2">
                {groupKey === "faculty" ? "Faculty" : "Student Leadership"}
              </div>
              <div className="space-y-2">
                {(groupKey === "faculty" ? faculty : leadership).map((lm) => (
                  <div key={lm.id} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center bg-finance-navy/30 p-3 rounded-lg">
                    <div className="md:col-span-2 font-medium text-foreground truncate">{lm.name}</div>
                    <div className="text-sm text-foreground/70 truncate">{lm.title}</div>
                    <div className="text-xs text-foreground/60 truncate">{groupKey === "faculty" ? "Faculty" : "Leadership"}</div>
                    <div className="flex gap-2 justify-end md:col-span-2">
                      <Button size="sm" onClick={() => { setLuminaryGroup(groupKey); setNewLuminary(lm); setEditingId(lm.id); }} className="bg-finance-gold text-finance-navy">Edit</Button>
                      <Button size="sm" onClick={() => updateMember(groupKey, lm.id, { name: lm.name })} className="bg-finance-teal text-finance-navy">Save</Button>
                      <Button size="sm" variant="destructive" onClick={() => removeMember(groupKey, lm.id)}>Remove</Button>
                    </div>
                  </div>
                ))}
                {(groupKey === "faculty" ? faculty : leadership).length === 0 && (
                  <div className="text-sm text-foreground/60">No members yet.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
