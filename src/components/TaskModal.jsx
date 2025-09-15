import { useState } from 'react';
import Modal from './Modal';

const emptyTask = { 
  title: '', 
  description: '', 
  priority: 'MEDIUM', 
  status: 'PENDING', 
  dueDate: '', 
  reminder: '', 
  subtasks: [] 
};

export default function TaskModal({ 
  title = "Add New Task", 
  onClose, 
  onSaved, 
  initial = emptyTask, 
  saveTask // pass a function to save the task (should return a promise)
}) {
  const [form, setForm] = useState({ ...emptyTask, ...initial });

  function updateField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function addSubtask() {
    setForm(f => ({ ...f, subtasks: [...(f.subtasks || []), { title: '', description: '', status: 'PENDING' }] }));
  }

  function updateSubtask(idx, key, val) {
    setForm(f => ({
      ...f,
      subtasks: f.subtasks.map((s, i) => i === idx ? { ...s, [key]: val } : s)
    }));
  }

  function removeSubtask(idx) {
    setForm(f => ({
      ...f,
      subtasks: f.subtasks.filter((_, i) => i !== idx)
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    await saveTask(form);
    onSaved?.();
    onClose?.();
  }

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onSubmit}>Save</button>
        </>
      }
    >
      <form className="modal-form" onSubmit={onSubmit}>
        <div className="form-row">
          <div>
            <div className="form-label">Task Title *</div>
            <input
              className="form-input"
              placeholder="Enter task title"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
              required
            />
          </div>
          <div>
            <div className="form-label">Priority</div>
            <select
              className="form-input"
              value={form.priority}
              onChange={e => updateField('priority', e.target.value)}
            >
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
        <div className="form-label" style={{ marginTop: 10 }}>Description</div>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Enter task description"
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
        />

        <div className="form-row" style={{ marginTop: 10 }}>
          <div>
            <div className="form-label">Deadline</div>
            <input
              className="form-input"
              type="date"
              value={form.dueDate || ''}
              onChange={e => updateField('dueDate', e.target.value)}
            />
          </div>
          <div>
            <div className="form-label">Status</div>
            <select
              className="form-input"
              value={form.status}
              onChange={e => updateField('status', e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="form-label">Reminder</div>
          <input
            className="form-input"
            type="datetime-local"
            value={form.reminder || ''}
            onChange={e => updateField('reminder', e.target.value)}
            placeholder="Set a reminder"
          />
        </div>

        {/* Subtasks UI */}
        <div className="form-label" style={{ marginTop: 16 }}>Subtasks</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {(form.subtasks || []).map((s, idx) => (
            <div key={idx} className="card" style={{ padding: 12 }}>
              <div className="form-row">
                <input
                  className="form-input"
                  placeholder="Subtask Title"
                  value={s.title}
                  onChange={e => updateSubtask(idx, 'title', e.target.value)}
                />
                <select
                  className="form-input"
                  value={s.status}
                  onChange={e => updateSubtask(idx, 'status', e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <textarea
                className="form-input"
                style={{ marginTop: 8 }}
                rows={2}
                placeholder="Subtask Description"
                value={s.description}
                onChange={e => updateSubtask(idx, 'description', e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <button type="button" className="btn btn-secondary" onClick={() => removeSubtask(idx)}>Remove</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addSubtask}>Add subtask</button>
        </div>
      </form>
    </Modal>
  );
}