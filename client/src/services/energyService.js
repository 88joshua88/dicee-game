import api from './api';

/**
 * energyService — all API calls for the Energy resource.
 * Used by Dashboard, CreateEnergy, Marketplace, and Profile pages.
 */

/** Create a new energy (requires auth token) */
export const createEnergy = async (energyData) => {
  const { data } = await api.post('/energies', energyData);
  return data.energy;
};

/** Get all energies (public) */
export const getAllEnergies = async () => {
  const { data } = await api.get('/energies');
  return data.energies;
};

/** Get a single energy by ID */
export const getEnergyById = async (id) => {
  const { data } = await api.get(`/energies/${id}`);
  return data.energy;
};

/** Get all energies belonging to a specific user */
export const getEnergiesByUser = async (userId) => {
  const { data } = await api.get(`/energies/user/${userId}`);
  return data.energies;
};

/**
 * groupByCategory — utility to group an array of energies by their
 * category field. Returns an object: { [category]: Energy[] }
 */
export const groupByCategory = (energies) =>
  energies.reduce((acc, energy) => {
    const key = energy.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(energy);
    return acc;
  }, {});
