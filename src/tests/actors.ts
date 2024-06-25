import { HttpAgent, Actor } from '@dfinity/agent';
import { idlFactory as backend_idl } from '../declarations/backend';

const agent = new HttpAgent();

const canisterId = import.meta.env.CANISTER_ID_BACKEND;

export const backendActor = Actor.createActor(backend_idl, {
  agent,
  canisterId,
});
