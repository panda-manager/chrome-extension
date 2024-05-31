import * as sha256 from 'sha256'
import * as CryptoJS from 'crypto-js'
import * as bcrypt from 'bcryptjs'

/*
Frontend pill
 ------------------   decrypt(k)
| salt | encrypted | -----------> pillData
 ------------------
*/

const saltLength = 29

export const createPill = (
  passwordToEncrypt: string,
  masterPassowrd: string
) => {
  const salt = bcrypt.genSaltSync(14)

  return encryptPill(passwordToEncrypt, getEncryptionKey(masterPassowrd, salt))
}

export const getEncryptionKey = (masterPassword: string, salt: string) =>
  bcrypt.hashSync(masterPassword, salt)

export const decryptPill = (pill, masterPassword) => {
  const salt = pill.slice(0, saltLength)
  const encryptionKey = getEncryptionKey(masterPassword, salt)

  return decryptPillWithKey(pill, encryptionKey)
}

export const decryptPillWithKey = (pill: string, encryptionKey: string) => {
  const encryptedPassword = pill.slice(saltLength)

  const plainPassword = CryptoJS.AES.decrypt(
    encryptedPassword,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8)

  return plainPassword
}

export const encryptPill = (plainPassword: string, encryptionKey: string) => {
  const salt = encryptionKey.slice(0, saltLength)
  const encryptedPassword = CryptoJS.AES.encrypt(
    plainPassword,
    encryptionKey
  ).toString()

  return salt + encryptedPassword
}

interface HashedCredentials {
  username: string
  password: string
}

interface HashedCredentials {
  username: string
  password: string
}

export const hashCredentials = (
  username: string,
  masterPassword: string
): HashedCredentials => {
  const salt =
    '$2a$12$' +
    sha256(username + masterPassword)
      .toString()
      .slice(0, 22)

  return {
    // slice -32 because bcrypt store the salt at the begginng of the hash
    // we dont want that
    username: sha256(username).toString().slice(-32),
    password: '', //bcrypt.hashSync(masterPassword, salt),
  }
}

//  CryptoJS.AES.encrypt('aaa', this.key).toString()

//  CryptoJS.AES.decrypt(this.b, this.key).toString(CryptoJS.enc.Utf8)
