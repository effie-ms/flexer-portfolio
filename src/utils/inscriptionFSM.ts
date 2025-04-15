// fsm/InscriptionFSM.ts
export type InscriptionState =
  | "idle"
  | "preparing_message"
  | "awaiting_signature"
  | "sending_transaction"
  | "waiting_confirmation"
  | "completed"
  | "failed";

type Event =
  | "START"
  | "MESSAGE_PREPARED"
  | "SIGNED"
  | "SENT"
  | "CONFIRMED"
  | "ERROR";

type Listener = (state: InscriptionState) => void;

const transitions: Record<
  InscriptionState,
  Partial<Record<Event, InscriptionState>>
> = {
  idle: {START: "preparing_message"},
  preparing_message: {MESSAGE_PREPARED: "awaiting_signature", ERROR: "failed"},
  awaiting_signature: {SIGNED: "sending_transaction", ERROR: "failed"},
  sending_transaction: {SENT: "waiting_confirmation", ERROR: "failed"},
  waiting_confirmation: {CONFIRMED: "completed", ERROR: "failed"},
  completed: {},
  failed: {},
};

class FSM {
  private state: InscriptionState = "idle";
  private listeners: Set<Listener> = new Set();

  getState() {
    return this.state;
  }

  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  onTransition(listener: Listener): () => void {
    this.listeners.add(listener);

    // Return an unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private transition(event: Event) {
    const next = transitions[this.state]?.[event];
    if (next) {
      this.state = next;
      this.listeners.forEach((fn) => fn(this.state));
    }
  }

  start() {
    this.transition("START");
  }
  messagePrepared() {
    this.transition("MESSAGE_PREPARED");
  }
  signed() {
    this.transition("SIGNED");
  }
  sent() {
    this.transition("SENT");
  }
  confirmed() {
    this.transition("CONFIRMED");
  }
  error() {
    this.transition("ERROR");
  }
}

export const inscriptionFSM = new FSM(); // singleton
