/**
 * @typedef {'guest' | 'user' | 'admin'} Role
 */

/**
 * @typedef {Object} AuthUser
 * @property {string} id
 * @property {string} email
 * @property {Role} role
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {AuthUser} user
 */

export {};
