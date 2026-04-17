'use client';
import { useState } from 'react';
import { Plus, X, Calculator, ChevronRight, Send, Building2 } from 'lucide-react';
import { submissions as initialSubmissions, consultants, vendors, getMargin, Submission } from '@/lib/mockData';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS: { key: Submission['status']; color: string; dotColor: string }[] = [
  { key: 'Submitted', color: 'var(--blue)', dotColor: '#3B82F6' },
  { key: 'Client Screening', color: 'var(--yellow)', dotColor: '#F59E0B' },
  { key: 'Round 1', color: 'var(--purple)', dotColor: '#8B5CF6' },
  { key: 'Round 2', color: 'var(--cyan)', dotColor: '#00F5FF' },
  { key: 'Offer', color: 'var(--green)', dotColor: '#10B981' },
  { key: 'Placed', color: '#22C55E', dotColor: '#22C55E' },
];

function MarginCalc({ buyRate, sellRate }: { buyRate: number; sellRate: number }) {
  const { hourly, monthly, pct } = getMargin(buyRate, sellRate);
  return (
    <div className="margin-calc">
      <div className="margin-calc-title">💡 Auto Margin Calculator</div>
      <div className="margin-row">
        <span className="margin-row-label">Sell Rate (Vendor)</span>
        <span className="margin-row-value">${sellRate}/hr</span>
      </div>
      <div className="margin-row">
        <span className="margin-row-label">Buy Rate (Consultant)</span>
        <span className="margin-row-value red">-${buyRate}/hr</span>
      </div>
      <div className="margin-row">
        <span className="margin-row-label">Gross Margin/hr</span>
        <span className="margin-row-value green">+${hourly}/hr</span>
      </div>
      <div className="margin-row">
        <span className="margin-row-label">Monthly Gross Profit</span>
        <span className="margin-row-value cyan">${monthly.toLocaleString()}/mo</span>
      </div>
      <div className="margin-row">
        <span className="margin-row-label">Margin %</span>
        <span className="margin-row-value green">{pct}%</span>
      </div>
    </div>
  );
}

function SubmissionModal({ onClose }: { onClose: () => void }) {
  const [buyRate, setBuyRate] = useState(55);
  const [sellRate, setSellRate] = useState(78);
  const [selectedConsultant, setSelectedConsultant] = useState(consultants[0].id);
  const [selectedVendor, setSelectedVendor] = useState(vendors[0].id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon"><Send size={18} /></div>
          <div>
            <div className="modal-title">New Submission</div>
            <div className="modal-subtitle">Submit consultant to vendor with rate details</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label>Consultant</label>
              <select value={selectedConsultant} onChange={e => setSelectedConsultant(e.target.value)}>
                {consultants.map(c => <option key={c.id} value={c.id}>{c.name} ({c.visaType})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Vendor / Prime</label>
              <select value={selectedVendor} onChange={e => setSelectedVendor(e.target.value)}>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.company}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Position / Role</label>
            <input placeholder="e.g. Java Developer, DevOps Engineer..." />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input placeholder="e.g. Remote, Dallas TX, New York NY" />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Buy Rate ($/hr) – What you pay consultant</label>
              <input type="number" value={buyRate} onChange={e => setBuyRate(Number(e.target.value))} min={0} />
            </div>
            <div className="form-group">
              <label>Sell Rate ($/hr) – What vendor pays you</label>
              <input type="number" value={sellRate} onChange={e => setSellRate(Number(e.target.value))} min={0} />
            </div>
          </div>

          <MarginCalc buyRate={buyRate} sellRate={sellRate} />

          <div className="form-group" style={{ marginTop: 16 }}>
            <label>Notes / Additional Info</label>
            <textarea placeholder="e.g. Vendor-specific requirements, submission priority..." rows={3} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>
            <Send size={14} /> Submit Candidate
          </button>
        </div>
      </div>
    </div>
  );
}

function KanbanCard({ sub }: { sub: Submission }) {
  const { hourly, pct } = getMargin(sub.buyRate, sub.sellRate);
  return (
    <div className="kanban-card">
      <div className="kanban-card-name">{sub.consultantName}</div>
      <div className="kanban-card-vendor">{sub.vendorName} · {sub.position}</div>
      <div className="kanban-card-meta">
        <span className="badge badge-green" style={{ fontSize: 10 }}>+${hourly}/hr</span>
        <span className="badge badge-cyan" style={{ fontSize: 10 }}>{pct}% margin</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>👤 {sub.recruiter}</span>
        <span>{sub.lastUpdated}</span>
      </div>
    </div>
  );
}

function SortableKanbanCard({ sub }: { sub: Submission }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sub.id,
    data: { type: 'Card', sub },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard sub={sub} />
    </div>
  );
}

function KanbanColumn({ col, cards, onAddClick }: { col: { key: Submission['status']; color: string; dotColor: string }, cards: Submission[], onAddClick: () => void }) {
  const { setNodeRef } = useDroppable({
    id: col.key,
    data: { type: 'Column', col },
  });

  return (
    <div className="kanban-column">
      <div className="kanban-col-header">
        <div className="kanban-col-dot" style={{ background: col.dotColor }} />
        <span className="kanban-col-title">{col.key}</span>
        <span className="kanban-count">{cards.length}</span>
      </div>
      <div className="kanban-col-body" ref={setNodeRef} style={{ minHeight: '150px' }}>
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map(sub => (
            <SortableKanbanCard key={sub.id} sub={sub} />
          ))}
        </SortableContext>
        <button
          style={{ background: 'transparent', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '8px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center', marginTop: 'auto' }}
          onClick={onAddClick}
        >
          <Plus size={12} /> Add
        </button>
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<Submission[]>(initialSubmissions);
  const [activeCard, setActiveCard] = useState<Submission | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const totalRevPotential = items
    .filter(s => !['Rejected'].includes(s.status))
    .reduce((sum, s) => sum + s.sellRate * 160, 0);
  const avgMargin = items.length > 0
    ? items.reduce((s, sub) => s + (sub.sellRate - sub.buyRate), 0) / items.length
    : 0;

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = items.find(i => i.id === active.id);
    if (card) setActiveCard(card);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Card';
    const isOverTask = over.data.current?.type === 'Card';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setItems(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);
        
        const newTasks = [...tasks];
        if (newTasks[activeIndex].status !== newTasks[overIndex].status) {
          newTasks[activeIndex].status = newTasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setItems(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId as Submission['status'];
        return arrayMove(newTasks, activeIndex, newTasks.length - 1);
      });
    }
  };

  const onDragEnd = () => {
    setActiveCard(null);
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Submission Pipeline</h1>
          <p>Kanban-style interview tracker · {items.length} total submissions</p>
        </div>
        <div className="top-bar-actions">
          <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 14px', display: 'flex', gap: 16, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Revenue Potential: <strong style={{ color: 'var(--green)' }}>${(totalRevPotential / 1000).toFixed(0)}K/mo</strong></span>
            <span style={{ color: 'var(--text-secondary)' }}>Avg Margin: <strong style={{ color: 'var(--cyan)' }}>${avgMargin.toFixed(0)}/hr</strong></span>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={14} /> New Submission
          </button>
        </div>
      </div>

      <div className="page-content">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="kanban-board">
            {COLUMNS.map(col => {
              const cards = items.filter(s => s.status === col.key);
              return <KanbanColumn key={col.key} col={col} cards={cards} onAddClick={() => setShowModal(true)} />;
            })}
          </div>
          <DragOverlay>
            {activeCard ? <KanbanCard sub={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {showModal && <SubmissionModal onClose={() => setShowModal(false)} />}
    </>
  );
}
