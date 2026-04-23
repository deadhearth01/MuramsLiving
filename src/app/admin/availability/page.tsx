"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus, X, Check, Search, CheckCircle, XCircle, AlertTriangle,
  Pencil, Trash2, ChevronDown, Layers,
} from "lucide-react";
import { logActivity } from "@/utils/activity-logger";

interface Room {
  id: string;
  room_no: string;
  building: "gold" | "silver";
  floor_name: string;
  floor_order: number;
  room_group: string;
  status: "available" | "occupied" | "maintenance";
}

type Status = "available" | "occupied" | "maintenance";

const statusConfig: Record<Status, { label: string; dot: string; bg: string; border: string; ring: string }> = {
  available:   { label: "Available",   dot: "bg-green-500",  bg: "bg-green-500",  border: "border-green-200", ring: "ring-green-300" },
  occupied:    { label: "Occupied",    dot: "bg-orange-500", bg: "bg-orange-500", border: "border-orange-200", ring: "ring-orange-300" },
  maintenance: { label: "Maintenance", dot: "bg-gray-400",   bg: "bg-gray-300",   border: "border-gray-200",  ring: "ring-gray-300" },
};

const FLOOR_ACCENTS = [
  { bar: "border-l-blue-400",   header: "bg-blue-50",   badge: "bg-blue-100 text-blue-700",   sudo: "bg-blue-600 hover:bg-blue-700" },
  { bar: "border-l-purple-400", header: "bg-purple-50", badge: "bg-purple-100 text-purple-700", sudo: "bg-purple-600 hover:bg-purple-700" },
  { bar: "border-l-amber-400",  header: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  sudo: "bg-amber-600 hover:bg-amber-700" },
  { bar: "border-l-teal-400",   header: "bg-teal-50",   badge: "bg-teal-100 text-teal-700",    sudo: "bg-teal-600 hover:bg-teal-700" },
  { bar: "border-l-rose-400",   header: "bg-rose-50",   badge: "bg-rose-100 text-rose-700",    sudo: "bg-rose-600 hover:bg-rose-700" },
  { bar: "border-l-indigo-400", header: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", sudo: "bg-indigo-600 hover:bg-indigo-700" },
];

interface RoomForm {
  building: "gold" | "silver";
  floor_name: string;
  floor_order: number;
  room_group: string;
  beds: number;
  status: Status;
}

const emptyForm: RoomForm = {
  building: "gold", floor_name: "", floor_order: 0, room_group: "", beds: 2, status: "available",
};

type Section = "hall" | "left" | "right" | "other";

const getBlockInfo = (roomGroup: string): { block: string; section: Section } => {
  const parts = roomGroup.trim().toUpperCase().split("-");
  const block = parts[0] || roomGroup;
  const suffix = parts[1] || "";
  if (suffix === "H") return { block, section: "hall" };
  if (suffix === "L") return { block, section: "left" };
  if (suffix === "R") return { block, section: "right" };
  return { block, section: "other" };
};

const getFloorCode = (name: string) =>
  name.split(/\s+/).filter(Boolean).map(w => w[0]).join("").toUpperCase() || "?";

export default function AvailabilityPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [buildingTab, setBuildingTab] = useState<"gold" | "silver">("gold");
  const [modal, setModal] = useState<"add" | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isNewFloor, setIsNewFloor] = useState(false);

  const [bulkConfirm, setBulkConfirm] = useState<{ status: "available" | "occupied"; step: 1 | 2 } | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);

  const [floorSudo, setFloorSudo] = useState<{ floorName: string } | null>(null);
  const [floorSudoSaving, setFloorSudoSaving] = useState(false);

  const [activeRoomUpdate, setActiveRoomUpdate] = useState<string | null>(null);
  const [editingRoomGroup, setEditingRoomGroup] = useState<string | null>(null);
  const [editRoomName, setEditRoomName] = useState("");
  const [renamingRoom, setRenamingRoom] = useState(false);

  const fetchRooms = useCallback(async () => {
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("rooms")
      .select("*")
      .order("floor_order", { ascending: true })
      .order("room_group")
      .order("room_no");
    if (err) setError(err.message);
    setRooms(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleAddRoom = async () => {
    if (!form.room_group.trim() || !form.floor_name.trim() || form.beds < 1) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const group = form.room_group.trim();
    const rows = Array.from({ length: form.beds }, (_, i) => ({
      room_no: `${group}-${i + 1}`,
      building: form.building,
      floor_name: form.floor_name.trim(),
      floor_order: Number(form.floor_order) || 0,
      room_group: group,
      status: form.status,
    }));
    const { error: err } = await supabase.from("rooms").insert(rows);
    if (err) { setError(err.message); setSaving(false); return; }
    setModal(null);
    setForm(emptyForm);
    setIsNewFloor(false);
    await fetchRooms();
    setSaving(false);
  };

  const handleRenameRoom = async (oldGroup: string, beds: Room[]) => {
    const newName = editRoomName.trim();
    if (!newName || newName === oldGroup) {
      setEditingRoomGroup(null);
      return;
    }
    setRenamingRoom(true);
    const supabase = createClient();
    const updates = beds.map(b => {
      const newRoomNo = b.room_no.startsWith(oldGroup)
        ? newName + b.room_no.slice(oldGroup.length)
        : b.room_no;
      return supabase.from("rooms")
        .update({ room_group: newName, room_no: newRoomNo, updated_at: new Date().toISOString() })
        .eq("id", b.id);
    });
    const results = await Promise.all(updates);
    const firstErr = results.find(r => r.error);
    if (firstErr?.error) setError(firstErr.error.message);
    await fetchRooms();
    setEditingRoomGroup(null);
    setRenamingRoom(false);
  };

  const handleInlineAddBed = async (beds: Room[]) => {
    if (beds.length === 0) return;
    const template = beds[0];
    const suffixes = beds
      .map(b => {
        const m = b.room_no.match(/-(\d+)([A-Za-z]?)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .filter(n => n > 0);
    const nextNum = suffixes.length > 0 ? Math.max(...suffixes) + 1 : beds.length + 1;
    const newRoomNo = `${template.room_group}-${nextNum}`;
    const supabase = createClient();
    const { error: err } = await supabase.from("rooms").insert({
      room_no: newRoomNo,
      building: template.building,
      floor_name: template.floor_name,
      floor_order: template.floor_order,
      room_group: template.room_group,
      status: "available",
    });
    if (err) { setError(err.message); return; }
    await fetchRooms();
  };

  const handleInlineDeleteBed = async (bed: Room, totalBeds: number) => {
    const msg = totalBeds === 1
      ? `Delete bed ${bed.room_no}? This is the LAST bed in room ${bed.room_group} — the entire room will be removed.`
      : `Delete bed ${bed.room_no}?`;
    if (!confirm(msg)) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("rooms").delete().eq("id", bed.id);
    if (err) { setError(err.message); return; }
    await fetchRooms();
  };

  const handleDeleteRoom = async (beds: Room[]) => {
    if (!confirm(`Delete room ${beds[0].room_group} and all ${beds.length} beds?`)) return;
    const supabase = createClient();
    const ids = beds.map(b => b.id);
    const { error: err } = await supabase.from("rooms").delete().in("id", ids);
    if (err) { setError(err.message); return; }
    setEditingRoomGroup(null);
    await fetchRooms();
  };

  const handleBulkMark = async (status: "available" | "occupied") => {
    setBulkSaving(true);
    const supabase = createClient();
    const ids = rooms.filter(r => r.building === buildingTab).map(r => r.id);
    await supabase.from("rooms").update({ status, updated_at: new Date().toISOString() }).in("id", ids);
    setRooms(prev => prev.map(r => r.building === buildingTab ? { ...r, status } : r));
    setBulkConfirm(null);
    setBulkSaving(false);
  };

  const handleFloorSudo = async (status: "available" | "occupied") => {
    if (!floorSudo) return;
    setFloorSudoSaving(true);
    const supabase = createClient();
    const ids = rooms
      .filter(r => r.floor_name === floorSudo.floorName && r.building === buildingTab)
      .map(r => r.id);
    await supabase.from("rooms").update({ status, updated_at: new Date().toISOString() }).in("id", ids);
    setRooms(prev => prev.map(r =>
      r.floor_name === floorSudo.floorName && r.building === buildingTab ? { ...r, status } : r
    ));
    setFloorSudo(null);
    setFloorSudoSaving(false);
  };

  const handleBedToggle = async (bed: Room) => {
    const newStatus: Status = bed.status === "available" ? "occupied" : "available";
    setRooms(prev => prev.map(r => r.id === bed.id ? { ...r, status: newStatus } : r));
    const supabase = createClient();
    await supabase.from("rooms").update({ status: newStatus, updated_at: new Date().toISOString() }).eq("id", bed.id);
    logActivity("toggle", "availability", `Bed ${bed.room_no} in ${bed.room_group}: ${bed.status} → ${newStatus}`);
  };

  const handleRoomUpdate = async (beds: Room[], status: "available" | "occupied") => {
    const supabase = createClient();
    const ids = beds.map(b => b.id);
    await supabase.from("rooms").update({ status, updated_at: new Date().toISOString() }).in("id", ids);
    setRooms(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r));
    setActiveRoomUpdate(null);
  };

  const filtered = rooms.filter(r => {
    const matchBuilding = r.building === buildingTab;
    const matchSearch = !search ||
      r.room_no.toLowerCase().includes(search.toLowerCase()) ||
      r.floor_name.toLowerCase().includes(search.toLowerCase()) ||
      (r.room_group || "").toLowerCase().includes(search.toLowerCase());
    return matchBuilding && matchSearch;
  });

  const groupedData: Record<string, { order: number; groups: Record<string, Room[]> }> = {};
  for (const room of filtered) {
    const floor = room.floor_name || "Other";
    if (!groupedData[floor]) groupedData[floor] = { order: room.floor_order ?? 99, groups: {} };
    const g = room.room_group || room.room_no;
    if (!groupedData[floor].groups[g]) groupedData[floor].groups[g] = [];
    groupedData[floor].groups[g].push(room);
  }
  const sortedFloors = Object.entries(groupedData).sort((a, b) => a[1].order - b[1].order);

  const currentBuildingRooms = rooms.filter(r => r.building === buildingTab);
  const availCount = currentBuildingRooms.filter(r => r.status === "available").length;
  const occupiedCount = currentBuildingRooms.filter(r => r.status === "occupied").length;
  const goldRooms = rooms.filter(r => r.building === "gold");
  const silverRooms = rooms.filter(r => r.building === "silver");

  const renderRoomCard = (groupName: string, beds: Room[]) => {
    const roomKey = `${buildingTab}::${groupName}`;
    const isUpdating = activeRoomUpdate === roomKey;
    const isEditing = editingRoomGroup === roomKey;
    const availBeds = beds.filter(b => b.status === "available").length;
    const allOccupied = availBeds === 0;
    const allAvailable = availBeds === beds.length;

    if (isEditing) {
      return (
        <div
          key={groupName}
          className="relative rounded-xl border-2 border-primary/40 bg-primary/5 p-4 shadow-md sm:col-span-2 lg:col-span-3"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-primary/70 mb-1">Room name</label>
              <input
                type="text"
                value={editRoomName}
                onChange={(e) => setEditRoomName(e.target.value)}
                className="w-full border border-primary/30 rounded-lg px-2.5 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                placeholder={groupName}
                disabled={renamingRoom}
              />
              <p className="text-[10px] text-gray-400 mt-1">{beds.length} bed{beds.length !== 1 ? "s" : ""} · changing name renames all beds</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={() => handleRenameRoom(groupName, beds)}
                disabled={renamingRoom}
                className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded-lg hover:bg-primary-dark transition-all disabled:opacity-60"
              >
                {renamingRoom ? "Saving..." : "Done"}
              </button>
              <button
                onClick={() => handleDeleteRoom(beds)}
                className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-2">Click circle to toggle status · X to delete bed · + to add bed</p>

          <div className="flex flex-wrap gap-2 items-center">
            {beds.map((bed) => (
              <div key={bed.id} className="relative group">
                <button
                  onClick={() => handleBedToggle(bed)}
                  title={`${bed.room_no} — ${statusConfig[bed.status].label}`}
                  className={`w-8 h-8 rounded-full ${statusConfig[bed.status].dot} cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 ${statusConfig[bed.status].ring}`}
                />
                <button
                  onClick={() => handleInlineDeleteBed(bed, beds.length)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Delete bed"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleInlineAddBed(beds)}
              className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center"
              title="Add bed"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={groupName}
        className={`relative rounded-xl border-2 p-3 transition-all ${
          isUpdating
            ? "border-primary/40 bg-primary/5 shadow-md"
            : allOccupied
            ? "border-orange-100 bg-orange-50/30"
            : allAvailable
            ? "border-green-100 bg-green-50/20"
            : "border-gray-100 bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-900 text-sm leading-tight">Room {groupName}</span>
          <span className="text-xs text-gray-400 font-medium">{beds.length}-sh</span>
        </div>

        {!isUpdating ? (
          <>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {beds.map((bed) => (
                <button
                  key={bed.id}
                  onClick={() => handleBedToggle(bed)}
                  title={`${bed.room_no} — ${statusConfig[bed.status].label} (click to toggle)`}
                  className={`w-6 h-6 rounded-full ${statusConfig[bed.status].dot} flex-shrink-0 cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 ${statusConfig[bed.status].ring} hover:scale-110 active:scale-95`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-1">
              <span className={`text-xs font-semibold ${
                allOccupied ? "text-orange-500" : allAvailable ? "text-green-600" : "text-gray-500"
              }`}>
                {allOccupied ? "Full" : allAvailable ? "Empty" : `${availBeds}/${beds.length} free`}
              </span>
              <button
                onClick={() => setActiveRoomUpdate(roomKey)}
                className="flex items-center gap-0.5 text-xs text-primary font-semibold hover:underline"
              >
                Update <ChevronDown size={10} />
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-1.5 mt-1">
            <p className="text-xs text-gray-400 mb-2">Set all {beds.length} beds to:</p>
            <button
              onClick={() => handleRoomUpdate(beds, "available")}
              className="w-full flex items-center gap-2 px-2.5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-white/60" />
              Available
            </button>
            <button
              onClick={() => handleRoomUpdate(beds, "occupied")}
              className="w-full flex items-center gap-2 px-2.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-white/60" />
              Occupied
            </button>
            <button
              onClick={() => setActiveRoomUpdate(null)}
              className="w-full py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>

            <div className="flex gap-1 pt-1 border-t border-gray-100 mt-1">
              <button
                onClick={() => {
                  setEditRoomName(groupName);
                  setEditingRoomGroup(roomKey);
                  setActiveRoomUpdate(null);
                }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 rounded-lg font-medium transition-all"
              >
                <Pencil size={10} /> Edit
              </button>
              <button
                onClick={() => { handleDeleteRoom(beds); setActiveRoomUpdate(null); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-all"
              >
                <Trash2 size={10} /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-40" />)}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Availability</h1>
          <p className="text-gray-500 text-sm mt-1">
            <span className="text-green-600 font-semibold">{availCount} available</span>
            {" · "}
            <span className="text-orange-600 font-semibold">{occupiedCount} occupied</span>
            {" · "}
            {currentBuildingRooms.length} total beds
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setBulkConfirm({ status: "available", step: 1 })}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-xl hover:bg-green-100 transition-all text-sm"
          >
            <CheckCircle size={15} /> Mark All Empty
          </button>
          <button
            onClick={() => setBulkConfirm({ status: "occupied", step: 1 })}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-orange-50 border border-orange-200 text-orange-700 font-semibold rounded-xl hover:bg-orange-100 transition-all text-sm"
          >
            <XCircle size={15} /> Mark All Full
          </button>
          <button
            onClick={() => { setForm({ ...emptyForm, building: buildingTab }); setIsNewFloor(false); setModal("add"); setError(""); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm shadow-sm"
          >
            <Plus size={16} /> Add Room
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex flex-wrap gap-2 flex-1">
          {Object.entries(statusConfig).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <span className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
              {v.label}
            </div>
          ))}
        </div>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-44"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["gold", "silver"] as const).map((b) => {
          const list = b === "gold" ? goldRooms : silverRooms;
          const avail = list.filter(r => r.status === "available").length;
          return (
            <button
              key={b}
              onClick={() => setBuildingTab(b)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                buildingTab === b ? "bg-primary text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:border-primary/30"
              }`}
            >
              <span>{b === "gold" ? "🥇" : "🥈"}</span>
              <span className="capitalize">{b} Building</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${buildingTab === b ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
                {avail} free
              </span>
            </button>
          );
        })}
      </div>

      {sortedFloors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
          <p className="text-lg font-medium">No rooms found</p>
          <p className="text-sm mt-1">Click &quot;Add Room&quot; to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedFloors.map(([floorName, { groups }], floorIdx) => {
            const accent = FLOOR_ACCENTS[floorIdx % FLOOR_ACCENTS.length];
            const floorRooms = Object.values(groups).flat();
            const floorAvail = floorRooms.filter(r => r.status === "available").length;
            const floorOccupied = floorRooms.filter(r => r.status === "occupied").length;

            const groupEntries = Object.entries(groups);
            const floorCode = getFloorCode(floorName);

            type BlockSections = { hall: [string, Room[]][]; left: [string, Room[]][]; right: [string, Room[]][]; other: [string, Room[]][] };
            const blocksMap: Record<string, BlockSections> = {};
            let hasBlocks = false;

            if (buildingTab === "silver") {
              for (const entry of groupEntries) {
                const { block, section } = getBlockInfo(entry[0]);
                if (!blocksMap[block]) blocksMap[block] = { hall: [], left: [], right: [], other: [] };
                blocksMap[block][section].push(entry);
              }
              hasBlocks = Object.values(blocksMap).some(b => b.hall.length + b.left.length + b.right.length > 0);
            }
            const sortedBlocks = Object.entries(blocksMap).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));

            return (
              <div
                key={floorName}
                className={`rounded-2xl shadow-sm border border-gray-100 overflow-hidden border-l-4 ${accent.bar}`}
              >
                <div className={`px-5 py-3.5 ${accent.header} border-b border-gray-100 flex items-center justify-between gap-3`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${accent.badge}`}>
                      {floorCode}
                    </span>
                    <span className="font-bold text-gray-900 truncate">{floorName}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {buildingTab === "silver" && hasBlocks ? `${sortedBlocks.length} block${sortedBlocks.length !== 1 ? "s" : ""} · ` : ""}
                      {Object.keys(groups).length} rooms · {floorRooms.length} beds
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="hidden sm:flex items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-green-500" />{floorAvail} avail.
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1 text-orange-600 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />{floorOccupied} occ.
                      </span>
                    </div>

                    <button
                      onClick={() => setFloorSudo({ floorName })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-all ${accent.sudo}`}
                    >
                      <Layers size={12} />
                      Sudo
                    </button>
                  </div>
                </div>

                {buildingTab === "silver" && hasBlocks ? (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {sortedBlocks.map(([blockName, sections]) => {
                        const blockRooms = [...sections.hall, ...sections.left, ...sections.right, ...sections.other].flatMap(([, b]) => b);
                        const blockAvail = blockRooms.filter(r => r.status === "available").length;
                        const blockOcc = blockRooms.filter(r => r.status === "occupied").length;
                        const blockTotal = blockRooms.length;
                        return (
                          <div
                            key={blockName}
                            className="rounded-2xl border border-slate-300/70 bg-white shadow-sm overflow-hidden"
                          >
                            <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white text-xs font-bold tracking-tight">
                                  {blockName}
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-white text-sm font-bold leading-tight">Block {blockName}</span>
                                  <span className="text-slate-300 text-[10px] leading-tight">{blockTotal} bed{blockTotal !== 1 ? "s" : ""}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 border border-green-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{blockAvail}
                                </span>
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />{blockOcc}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-slate-100/60 to-slate-50">
                              {sections.hall.length > 0 && (
                                <div className="mb-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider rounded-md border border-amber-200">
                                      ⬤ Hall
                                    </span>
                                    <div className="flex-1 h-px bg-amber-200/40" />
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {sections.hall.map(([gn, beds]) => renderRoomCard(gn, beds))}
                                  </div>
                                </div>
                              )}

                              <div className="relative grid grid-cols-2 gap-3">
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent -translate-x-1/2" />

                                <div>
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-200">
                                      ◀ Left
                                    </span>
                                  </div>
                                  {sections.left.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic py-3 text-center border-2 border-dashed border-slate-200 rounded-lg bg-white/40">Empty</p>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                      {sections.left.map(([gn, beds]) => renderRoomCard(gn, beds))}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <div className="flex items-center justify-end gap-1.5 mb-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider rounded-md border border-rose-200">
                                      Right ▶
                                    </span>
                                  </div>
                                  {sections.right.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic py-3 text-center border-2 border-dashed border-slate-200 rounded-lg bg-white/40">Empty</p>
                                  ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                      {sections.right.map(([gn, beds]) => renderRoomCard(gn, beds))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {sections.other.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-dashed border-slate-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Other</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {sections.other.map(([gn, beds]) => renderRoomCard(gn, beds))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {groupEntries.map(([groupName, beds]) => renderRoomCard(groupName, beds))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {floorSudo && (() => {
        const floorRooms = rooms.filter(r => r.floor_name === floorSudo.floorName && r.building === buildingTab);
        const fAvail = floorRooms.filter(r => r.status === "available").length;
        const fOcc = floorRooms.filter(r => r.status === "occupied").length;
        const floorIdx = sortedFloors.findIndex(([fn]) => fn === floorSudo.floorName);
        const accent = FLOOR_ACCENTS[floorIdx >= 0 ? floorIdx % FLOOR_ACCENTS.length : 0];
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className={`px-6 py-4 ${accent.header} border-b border-gray-100 flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>Sudo</span>
                    <span className="font-bold text-gray-900">{floorSudo.floorName}</span>
                  </div>
                  <p className="text-xs text-gray-500">{floorRooms.length} beds · {fAvail} available · {fOcc} occupied</p>
                </div>
                <button onClick={() => setFloorSudo(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-5">
                  Update all <strong>{floorRooms.length} beds</strong> on this floor at once:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={floorSudoSaving}
                    onClick={() => handleFloorSudo("available")}
                    className="flex flex-col items-center gap-2 py-5 px-3 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-all disabled:opacity-60"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-green-700 text-sm">Mark All</span>
                    <span className="text-xs text-green-600">Available</span>
                  </button>
                  <button
                    disabled={floorSudoSaving}
                    onClick={() => handleFloorSudo("occupied")}
                    className="flex flex-col items-center gap-2 py-5 px-3 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-xl transition-all disabled:opacity-60"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                      <XCircle size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-orange-700 text-sm">Mark All</span>
                    <span className="text-xs text-orange-600">Occupied</span>
                  </button>
                </div>

                {floorSudoSaving && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                    Updating all beds...
                  </div>
                )}

                <button
                  onClick={() => setFloorSudo(null)}
                  className="mt-4 w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {bulkConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                bulkConfirm.status === "available" ? "bg-green-100" : "bg-orange-100"
              }`}>
                <AlertTriangle size={26} className={bulkConfirm.status === "available" ? "text-green-600" : "text-orange-600"} />
              </div>

              {bulkConfirm.step === 1 ? (
                <>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Mark Entire {buildingTab === "gold" ? "Gold" : "Silver"} Building as{" "}
                    {bulkConfirm.status === "available" ? "Available" : "Occupied"}?
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    This will update all <strong>{currentBuildingRooms.length} beds</strong> in the{" "}
                    {buildingTab === "gold" ? "🥇 Gold" : "🥈 Silver"} building.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setBulkConfirm(null)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-sm">
                      Cancel
                    </button>
                    <button
                      onClick={() => setBulkConfirm({ ...bulkConfirm, step: 2 })}
                      className={`flex-1 py-3 font-semibold rounded-xl text-sm text-white ${
                        bulkConfirm.status === "available" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Are you absolutely sure?</h3>
                  <p className="text-gray-500 text-sm mb-1">
                    Every bed in the {buildingTab === "gold" ? "Gold" : "Silver"} building will be marked{" "}
                    <strong className={bulkConfirm.status === "available" ? "text-green-600" : "text-orange-600"}>
                      {bulkConfirm.status === "available" ? "Available" : "Occupied"}
                    </strong>.
                  </p>
                  <p className="text-xs text-gray-400 mb-6">This cannot be undone automatically.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setBulkConfirm(null)} className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-sm">
                      No, Cancel
                    </button>
                    <button
                      onClick={() => handleBulkMark(bulkConfirm.status)}
                      disabled={bulkSaving}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl text-sm text-white disabled:opacity-60 ${
                        bulkConfirm.status === "available" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
                      }`}
                    >
                      {bulkSaving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : <><Check size={15} /> Yes, Mark All</>}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {modal === "add" && (() => {
        const buildingRooms = rooms.filter(r => r.building === form.building);
        const existingFloors = Array.from(
          new Map(buildingRooms.map(r => [r.floor_name, r.floor_order])).entries()
        ).filter(([f]) => f).sort((a, b) => a[1] - b[1]);
        const existingGroups = new Set(buildingRooms.map(r => r.room_group));
        const isDuplicateGroup = form.room_group.trim() && existingGroups.has(form.room_group.trim());
        const canSave = !saving && form.room_group.trim() && form.floor_name.trim() && form.beds >= 1 && !isDuplicateGroup;

        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Add New Room</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Creates a room with multiple beds</p>
                </div>
                <button onClick={() => { setModal(null); setForm(emptyForm); setIsNewFloor(false); setError(""); }} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{error}</div>}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Building</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["gold", "silver"] as const).map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => { setForm({ ...form, building: b, floor_name: "", floor_order: 0 }); setIsNewFloor(false); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          form.building === b
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        <span>{b === "gold" ? "🥇" : "🥈"}</span>
                        <span className="capitalize">{b}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">On Which Floor?</label>
                  <select
                    value={isNewFloor ? "__new__" : form.floor_name}
                    onChange={(e) => {
                      const f = e.target.value;
                      if (f === "__new__") {
                        setIsNewFloor(true);
                        setForm({ ...form, floor_name: "", floor_order: (existingFloors[existingFloors.length - 1]?.[1] ?? 0) + 1 });
                      } else if (f === "") {
                        setIsNewFloor(false);
                        setForm({ ...form, floor_name: "", floor_order: 0 });
                      } else {
                        setIsNewFloor(false);
                        const match = buildingRooms.find(r => r.floor_name === f);
                        setForm({ ...form, floor_name: f, floor_order: match?.floor_order ?? 0 });
                      }
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                  >
                    <option value="">-- Select a floor --</option>
                    {existingFloors.map(([f]) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                    <option value="__new__">+ Create New Floor</option>
                  </select>

                  {isNewFloor && (
                    <div className="grid grid-cols-[1fr_auto] gap-2 mt-2">
                      <input
                        type="text"
                        value={form.floor_name}
                        onChange={(e) => setForm({ ...form, floor_name: e.target.value })}
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Floor name (e.g., Ground Floor)"
                        autoFocus
                      />
                      <input
                        type="number"
                        value={form.floor_order || ""}
                        onChange={(e) => setForm({ ...form, floor_order: Number(e.target.value) })}
                        className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Order"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={form.room_group}
                    onChange={(e) => setForm({ ...form, room_group: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                      isDuplicateGroup ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-primary/20"
                    }`}
                    placeholder={form.building === "silver" ? "e.g., GF1-L, SF2-R" : "e.g., 31"}
                  />
                  {isDuplicateGroup && (
                    <p className="text-xs text-red-500 mt-1">Room &quot;{form.room_group}&quot; already exists in {form.building}</p>
                  )}
                  {!isDuplicateGroup && form.room_group && (
                    <p className="text-xs text-gray-400 mt-1">Will create beds: {Array.from({ length: form.beds }, (_, i) => `${form.room_group}-${i + 1}`).join(", ")}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Bed Sharing</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 6].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setForm({ ...form, beds: n })}
                        className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          form.beds === n
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Number of beds in this room</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Initial Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(statusConfig) as [Status, typeof statusConfig[Status]][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm({ ...form, status: key })}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                          form.status === key
                            ? `${cfg.border} ${key === "available" ? "bg-green-50 text-green-700" : key === "occupied" ? "bg-orange-50 text-orange-700" : "bg-gray-100 text-gray-600"}`
                            : "border-gray-100 text-gray-400 hover:border-gray-200"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.bg}`} />
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => { setModal(null); setForm(emptyForm); setIsNewFloor(false); setError(""); }}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRoom}
                  disabled={!canSave}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                    : <><Check size={16} /> Create Room ({form.beds} bed{form.beds !== 1 ? "s" : ""})</>
                  }
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
