import React, { useState } from 'react';
import { User, Users, Plus, Check, Trash2, X, Shield, Heart, ChevronDown } from 'lucide-react';
import { UserProfile } from '../types/user.ts';
import { getUsers, getActiveUser, switchActiveUser, createUser, deleteUserAndData } from '../services/userService.ts';

interface UserProfileSelectorProps {
  onUserChanged: (user: UserProfile) => void;
  onOpenDeleteModal: (user: UserProfile) => void;
}

export const UserProfileSelector: React.FC<UserProfileSelectorProps> = ({
  onUserChanged,
  onOpenDeleteModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>(getUsers());
  const activeUser = getActiveUser();

  // Add User Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [relationship, setRelationship] = useState<UserProfile['relationship']>('Self');
  const [bloodGroup, setBloodGroup] = useState('B+');

  const refreshUsers = () => {
    setUsers(getUsers());
  };

  const handleSwitch = (userId: string) => {
    const switched = switchActiveUser(userId);
    refreshUsers();
    onUserChanged(switched);
    setIsOpen(false);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = [
      'from-teal-500 to-emerald-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created = createUser({
      name: name.trim(),
      age: parseInt(age) || 30,
      gender,
      relationship,
      bloodGroup,
      avatarColor: randomColor,
      activeMedications: []
    });

    setName('');
    setIsAddModalOpen(false);
    refreshUsers();
    onUserChanged(created);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Active User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all text-xs font-semibold text-slate-800 shadow-2xs"
      >
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${activeUser.avatarColor} text-white flex items-center justify-center font-bold text-[10px]`}>
          {activeUser.name.charAt(0)}
        </div>
        <div className="text-left hidden sm:block">
          <span className="block text-slate-900 leading-tight font-bold">{activeUser.name}</span>
          <span className="block text-[10px] text-slate-500 font-normal">{activeUser.relationship || 'Profile'}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      </button>

      {/* User Dropdown */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-200/90 z-50 p-2 space-y-1 animate-scaleUp">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-600" /> Family Profiles
            </span>
            <span className="text-[10px] font-normal text-slate-400">{users.length} active</span>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 py-1">
            {users.map((u) => {
              const isSelected = u.id === activeUser.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSwitch(u.id)}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${u.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-[10px] text-slate-400 font-normal">
                        {u.age} yrs • {u.gender} {u.bloodGroup ? `• ${u.bloodGroup}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        onOpenDeleteModal(u);
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Delete User & Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsAddModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" /> Add Family Member
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-['Outfit'] text-base">
                <Users className="w-5 h-5 text-teal-600" />
                Add New Family Member
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Jadhav, Mom, Self"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age:</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Relationship:</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none bg-white"
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Patient">Patient</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group:</label>
                  <input
                    type="text"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    placeholder="e.g. B+, O+, A-"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-teal-500 outline-none uppercase"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};