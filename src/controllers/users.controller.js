const bcrypt = require('bcrypt');
const Users = require('../models/user.model');

const SALT_ROUNDS = 10;

const createUser = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;

    if (!password) return res.status(400).json({ status: 'error', message: 'password requerido' });

    const exists = await Users.findOne({ email: email?.toLowerCase().trim() });
    if (exists) return res.status(409).json({ status: 'error', message: 'Email ya registrado' });

    const hash = bcrypt.hashSync(password, SALT_ROUNDS);

    const user = await Users.create({
      first_name, last_name, email, age, password: hash, cart: cart || null, role: role || 'user'
    });

    const { password: _, ...safeUser } = user.toObject();
    return res.status(201).json({ status: 'success', payload: safeUser });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await Users.find().select('-password').populate('cart');
    res.json({ status: 'success', payload: users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.uid;
    if (req.user.role !== 'admin' && String(req.user._id) !== id) {
      return res.status(403).json({ status: 'error', message: 'No autorizado' });
    }

    const user = await Users.findById(id).select('-password').populate('cart');
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    res.json({ status: 'success', payload: user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.uid;
    if (req.user.role !== 'admin' && String(req.user._id) !== id) {
      return res.status(403).json({ status: 'error', message: 'No autorizado' });
    }

    const toUpdate = { ...req.body };

    if (toUpdate.password) {
      toUpdate.password = bcrypt.hashSync(toUpdate.password, 10);
    }

    if (toUpdate.email) {
      toUpdate.email = toUpdate.email.toLowerCase().trim();
    }

    const updated = await Users.findByIdAndUpdate(id, toUpdate, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    res.json({ status: 'success', payload: updated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ status: 'error', message: 'Email ya registrado' });
    }
    res.status(500).json({ status: 'error', message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.uid;
    if (req.user.role !== 'admin' && String(req.user._id) !== id) {
      return res.status(403).json({ status: 'error', message: 'No autorizado' });
    }

    const deleted = await Users.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    res.json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };
