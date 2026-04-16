cat > .agents/memory-availability-rewrite.md << 'ENDOFMEMORY'
# Memory File — Admin Availability Page Rewrite

## STATUS OVERVIEW (as of this session)

### COMPLETED (all clean, 0 errors):
1. **SMTP Fix** — `src/app/api/send-booking-email/route.ts` and `src/app/api/send-admin-notification/route.ts`
   - Switched from Resend API to nodemailer SMTP
   - Added `transporter.verify()` for upfront auth checking
   - Returns 503 when SMTP not configured (not 200)
   - Sends booking confirmation to BOTH user and admin email

2. **Gallery Page** — `src/app/gallery/GalleryPageClient.tsx`
   - Added Gold/Silver building tabs with framer-motion pill animation
   - Items 1-15 = gold, 16-30 = silver
   - Building > Category cascaded filtering
   - Count badges on tabs

3. **Footer** — `src/components/layout/Footer.tsx`
   - Silver Building quick link now bold with animated shimmer gradient
   - Uses CSS keyframes `silverShimmer` with background-clip: text
   - Sparkles icon next to the link

4. **Navbar** — `src/components/layout/Header.tsx`
   - Added Silver Building as direct link
   - Added "Stay With Us" dropdown with For Students / For Tourists
   - Desktop: hover dropdown with framer-motion animation
   - Mobile: collapsible section

5. **Silver Pricing** — `src/app/silver/SilverPageClient.tsx`
   - Changed from AC/Non-AC to bed-sharing pricing (2/3/4 sharing)
   - Grid now md:grid-cols-3 for 3 cards
   - Book links include sharing parameter

6. **Booking Page** — `src/app/book/page.tsx`
   - Removed 6-sharing option
   - Sharing type now: "any" | "2" | "3" | "4"
   - Grid changed to grid-cols-2 sm:grid-cols-4

7. **Activity Log Fix** — `src/app/api/admin/login/route.ts` and `src/app/api/log-activity/route.ts`
   - Changed httpOnly: true to httpOnly: false on session cookie
   - Added diagnostic logging to log-activity route

### BROKEN (25 TypeScript errors):
8. **Admin Availability** — `src/app/admin/availability/page.tsx`
   - A previous agent attempted all 3 changes but ran out of context
   - File has duplicate return statements, duplicate code blocks, broken JSX
   - Must be COMPLETELY rewritten from scratch

---

## WHAT THE AVAILABILITY PAGE NEEDS (3 CHANGES)

### Change 1: Replace popup modal EDIT with inline bed management
- Currently clicking Edit on a room card opens a full-screen popup modal
- NEW: Edit should expand the room card INLINE
- Show each bed as a w-8 h-8 circle with bed number suffix inside
- Each bed has an X delete button (top-right, visible on hover)
- A dashed circle with + at the end adds a new bed
- Adding auto-generates next bed number (e.g., room group "31" with beds 31-1,31-2,31-3 → next is 31-4)
- Auto-fills building, floor_name, floor_order from existing beds in the group
- "Done" button to collapse back
- Status toggle (click circle) still works in edit mode
- KEEP the "Add Bed" button in header for adding to NEW room groups (this still uses modal)
- The modal type changes from `"add" | "edit" | null` to `"add" | null`

### Change 2: Silver Building wing layout
- Silver building has floors with Left and Right wings/blocks
- Room naming convention: "GF1-L" (Ground Floor, Block 1, Left), "SF2-R" (Second Floor, Block 2, Right), "GF1-H" (Hall)
- When buildingTab === "silver", classify room groups by wing:
  - Name contains/ends with L → left wing
  - Name contains/ends with R → right wing
  - Otherwise → other
- If a floor HAS wing rooms: render 2-column layout (Left Wing | Right Wing) with labeled headers
- "Other" rooms go in a full-width row above
- If no wing rooms: use normal flat grid (same as Gold)
- This is VISUAL only — data model unchanged

### Change 3: Fix "Create New Floor" in Add Bed modal
- BUG: Selecting "+ Create New Floor" sets floor_name to ""
- Conditional `{form.floor_name === "" && (<input ...>)}` means input disappears after 1 character typed
- FIX: Add `isNewFloor` boolean state
- When "+ Create New Floor" selected: setIsNewFloor(true), setForm floor_name to ""
- Show text input when isNewFloor === true (not when floor_name === "")
- When selecting existing floor: setIsNewFloor(false)
- Select value: `isNewFloor ? "__new__" : form.floor_name`

---

## ORIGINAL WORKING FILE STRUCTURE (before it was broken)

The ORIGINAL file was 779 lines. Here is its exact structure:

### Imports (L1-9)
```
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, X, Check, Search, CheckCircle, XCircle, AlertTriangle, Pencil, Trash2, ChevronDown, Layers } from "lucide-react";
import { logActivity } from "@/utils/activity-logger";
```

### Room Interface (L11-19)
```
interface Room {
  id: string;
  room_no: string;
  building: "gold" | "silver";
  floor_name: string;
  floor_order: number;
  room_group: string;
  status: "available" | "occupied" | "maintenance";
}
```

### Status type & config (L21-27)
```
type Status = "available" | "occupied" | "maintenance";
const statusConfig: Record<Status, { label: string; dot: string; bg: string; border: string; ring: string }> = {
  available:   { label: "Available",   dot: "bg-green-500",  bg: "bg-green-500",  border: "border-green-200", ring: "ring-green-300" },
  occupied:    { label: "Occupied",    dot: "bg-orange-500", bg: "bg-orange-500", border: "border-orange-200", ring: "ring-orange-300" },
  maintenance: { label: "Maintenance", dot: "bg-gray-400",   bg: "bg-gray-300",   border: "border-gray-200",  ring: "ring-gray-300" },
};
```

### Floor accents (L30-37) — 6 color schemes that cycle
```
const FLOOR_ACCENTS = [
  { bar: "border-l-blue-400",   header: "bg-blue-50",   badge: "bg-blue-100 text-blue-700",   sudo: "bg-blue-600 hover:bg-blue-700" },
  { bar: "border-l-purple-400", header: "bg-purple-50", badge: "bg-purple-100 text-purple-700", sudo: "bg-purple-600 hover:bg-purple-700" },
  { bar: "border-l-amber-400",  header: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  sudo: "bg-amber-600 hover:bg-amber-700" },
  { bar: "border-l-teal-400",   header: "bg-teal-50",   badge: "bg-teal-100 text-teal-700",    sudo: "bg-teal-600 hover:bg-teal-700" },
  { bar: "border-l-rose-400",   header: "bg-rose-50",   badge: "bg-rose-100 text-rose-700",    sudo: "bg-rose-600 hover:bg-rose-700" },
  { bar: "border-l-indigo-400", header: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", sudo: "bg-indigo-600 hover:bg-indigo-700" },
];
```

### emptyRoom constant (L39-41)
```
const emptyRoom: { room_no: string; building: "gold" | "silver"; floor_name: string; floor_order: number; room_group: string; status: Status; id?: string } = {
  room_no: "", building: "gold", floor_name: "", floor_order: 0, room_group: "", status: "available",
};
```

### Component state variables (L44-62)
- rooms, loading, search, buildingTab
- modal ("add" | "edit" | null) — CHANGE TO ("add" | null)
- form, saving, error
- bulkConfirm, bulkSaving
- floorSudo, floorSudoSaving
- activeRoomUpdate
- ADD: isNewFloor (boolean)
- ADD: editingRoomGroup (string | null)

### fetchRooms (L64-75)
Queries supabase rooms table, orders by floor_order, room_group, room_no.

### handleSave (L80-105)
Originally handled both add and edit. CHANGE: Only handle add now.

### handleDelete (L107-113)
Deletes a bed by ID with confirmation.

### handleBulkMark (L116-124)
Marks all beds in current building.

### handleFloorSudo (L127-140)
Marks all beds on a specific floor.

### handleBedToggle (L143-150)
Toggles a single bed between available/occupied. Logs activity.

### handleRoomUpdate (L153-159)
Updates ALL beds in a room group to a status.

### Filtering + grouping (L162-185)
```
const filtered = rooms.filter(r => {
  const matchBuilding = r.building === buildingTab;
  const matchSearch = !search || r.room_no/floor_name/room_group matches;
  return matchBuilding && matchSearch;
});

// Group by floor -> room_group
const groupedData = {};
for (const room of filtered) { ... }
const sortedFloors = Object.entries(groupedData).sort by order;

const currentBuildingRooms = rooms.filter(r => r.building === buildingTab);
const availCount = currentBuildingRooms.filter(available).length;
const occupiedCount = currentBuildingRooms.filter(occupied).length;
const goldRooms = rooms.filter(gold);
const silverRooms = rooms.filter(silver);
```

### Loading skeleton (L187-192)
Early return with 3 animated placeholder divs.

### JSX Return (L194-779)
Structure:
1. Header (title, stats, bulk buttons, Add Bed button)
2. Error alert
3. Legend + Search
4. Building Tabs (gold/silver)
5. Floors loop — for each floor:
   - Floor header with accent, badge, stats, Sudo button
   - Room cards grid (each card has bed circles, status, Update button)
6. Floor Sudo Modal
7. Bulk Confirmation Modal (2-step)
8. Add/Edit Bed Modal (form with building, room group, floor, bed number, status)

### Room Card (was inline, L335-445)
Each card shows:
- Room group name + sharing count
- Colored circles per bed (click to toggle)
- Status summary (Full/Empty/X/Y free)
- Update button → shows inline picker (Available/Occupied + Edit/Delete buttons)
- Edit button opens popup modal — THIS IS WHAT CHANGES TO INLINE

### Add/Edit Modal (L575-779)
Fields: Building dropdown, Room Group (existing or new), Floor (existing or new), Floor Order, Bed/Room No, Status.
The floor dropdown has a "+ Create New Floor" option — THIS HAS THE BUG.

---

## NEW FUNCTIONS TO ADD

### getSilverWing (before component)
```
const getSilverWing = (roomGroup: string): "left" | "right" | "other" => {
  const upper = roomGroup.trim().toUpperCase();
  if (upper.includes("-L") || upper.endsWith("L")) return "left";
  if (upper.includes("-R") || upper.endsWith("R")) return "right";
  return "other";
};
```

### handleInlineAddBed (inside component)
Auto-generates next bed number for a room group and inserts it.

### handleInlineDeleteBed (inside component)
Deletes a single bed with confirmation. If last bed, warns about removing entire room.

### renderRoomCard (inside component, before return)
Extracted function that renders a room card. Has 3 modes:
1. isEditing: larger circles with numbers, X delete, + add, Done button
2. isUpdating: Available/Occupied picker + Edit/Delete (Edit sets editingRoomGroup)
3. Default: small circles + status + Update button

---

## DESIGN NOTES
- Do NOT use HTML entities (no &laquo; etc.) — use unicode characters directly
- Use Tailwind classes consistent with the rest of the admin panel
- The inline edit mode card should expand with `sm:col-span-2` class
- Wing headers use decorative lines with colored labels
- All existing functionality must be preserved (bed toggle, bulk ops, sudo, search, building tabs)

---

## DATABASE
- Table: `rooms`
- Columns: id, room_no, building (gold|silver), floor_name, floor_order, room_group, status (available|occupied|maintenance), updated_at
- Uses `@/utils/supabase/client` createClient()
ENDOFMEMORY
