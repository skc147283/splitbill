import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupService, expenseService, settlementService } from '../services/api';

interface Member {
  id: string;
  name: string;
  email: string;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  paidByName: string;
  createdAt: string;
  splits: Array<{ userId: string; amount: number }>;
}

interface Group {
  id: string;
  name: string;
  members: Member[];
}

export const GroupDetailPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    paidBy: '',
  });
  const [splits, setSplits] = useState<Record<string, number>>({});

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
      fetchExpenses();
    }
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      const response = await groupService.getGroup(groupId!);
      setGroup(response.data);
      const initialSplits: Record<string, number> = {};
      response.data.members.forEach((m: Member) => {
        initialSplits[m.id] = 0;
      });
      setSplits(initialSplits);
    } catch (error) {
      console.error('Failed to fetch group:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getExpenses(groupId!);
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await groupService.addMember(groupId!, memberEmail);
      setMemberEmail('');
      setShowAddMember(false);
      fetchGroupData();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expenseService.createExpense(
        groupId!,
        expenseData.description,
        parseFloat(expenseData.amount),
        splits
      );
      setExpenseData({ description: '', amount: '', paidBy: '' });
      setSplits({});
      setShowAddExpense(false);
      fetchExpenses();
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading group...</div>;
  }

  if (!group) {
    return <div style={styles.error}>Group not found</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/groups')} style={styles.backBtn}>
          ← Back
        </button>
        <h1 style={styles.title}>{group.name}</h1>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          style={styles.headerBtn}
        >
          {showAddMember ? '✕' : '+ Add Member'}
        </button>
      </div>

      {showAddMember && (
        <form onSubmit={handleAddMember} style={styles.form}>
          <input
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="Friend's email"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.submitBtn}>
            Add Member
          </button>
        </form>
      )}

      <div style={styles.section}>
        <h3>Members ({group.members.length})</h3>
        <div style={styles.membersList}>
          {group.members.map((member) => (
            <div key={member.id} style={styles.memberTag}>
              {member.name}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3>Expenses</h3>
          <button
            onClick={() => setShowAddExpense(!showAddExpense)}
            style={styles.headerBtn}
          >
            {showAddExpense ? '✕' : '+ Add Expense'}
          </button>
        </div>

        {showAddExpense && (
          <form onSubmit={handleAddExpense} style={styles.form}>
            <input
              type="text"
              value={expenseData.description}
              onChange={(e) =>
                setExpenseData({ ...expenseData, description: e.target.value })
              }
              placeholder="Description"
              required
              style={styles.input}
            />
            <input
              type="number"
              value={expenseData.amount}
              onChange={(e) =>
                setExpenseData({ ...expenseData, amount: e.target.value })
              }
              placeholder="Amount"
              required
              step="0.01"
              style={styles.input}
            />
            <select
              value={expenseData.paidBy}
              onChange={(e) =>
                setExpenseData({ ...expenseData, paidBy: e.target.value })
              }
              required
              style={styles.input}
            >
              <option value="">Who paid?</option>
              {group.members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div style={styles.splitsSection}>
              <p>Split between:</p>
              {group.members.map((member) => (
                <div key={member.id} style={styles.splitItem}>
                  <label>{member.name}:</label>
                  <input
                    type="number"
                    value={splits[member.id] || 0}
                    onChange={(e) =>
                      setSplits({
                        ...splits,
                        [member.id]: parseFloat(e.target.value),
                      })
                    }
                    step="0.01"
                    style={styles.splitInput}
                  />
                </div>
              ))}
            </div>
            <button type="submit" style={styles.submitBtn}>
              Add Expense
            </button>
          </form>
        )}

        {expenses.length === 0 ? (
          <div style={styles.empty}>No expenses yet</div>
        ) : (
          <div style={styles.expensesList}>
            {expenses.map((expense) => (
              <div key={expense.id} style={styles.expenseCard}>
                <div>
                  <p style={styles.expenseDesc}>{expense.description}</p>
                  <p style={styles.expenseDetails}>
                    ${expense.amount.toFixed(2)} paid by {expense.paidByName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  title: {
    margin: '0',
    flex: 1,
  },
  headerBtn: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
  },
  splitsSection: {
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  splitItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  splitInput: {
    width: '80px',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  submitBtn: {
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  membersList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  memberTag: {
    backgroundColor: '#e7f3ff',
    color: '#0056b3',
    padding: '8px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '20px',
    color: '#999',
  },
  expensesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '16px',
  },
  expenseCard: {
    padding: '16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff',
  },
  expenseDesc: {
    margin: '0 0 4px 0',
    fontWeight: '500',
    color: '#333',
  },
  expenseDetails: {
    margin: '0',
    fontSize: '13px',
    color: '#666',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#666',
  },
  error: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#dc3545',
  },
};
