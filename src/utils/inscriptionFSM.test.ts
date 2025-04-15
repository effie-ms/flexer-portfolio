import {inscriptionFSM} from "./inscriptionFSM";

describe("inscriptionFSM", () => {
  let unsub: () => void;
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset FSM by creating a new instance
    inscriptionFSM["state"] = "idle";
    inscriptionFSM["listeners"].clear();
    callback = vi.fn();
    unsub = inscriptionFSM.subscribe(callback);
  });

  it("starts from idle and follows the happy path", () => {
    inscriptionFSM.start();
    expect(inscriptionFSM.getState()).toBe("preparing_message");

    inscriptionFSM.messagePrepared();
    expect(inscriptionFSM.getState()).toBe("awaiting_signature");

    inscriptionFSM.signed();
    expect(inscriptionFSM.getState()).toBe("sending_transaction");

    inscriptionFSM.sent();
    expect(inscriptionFSM.getState()).toBe("waiting_confirmation");

    inscriptionFSM.confirmed();
    expect(inscriptionFSM.getState()).toBe("completed");

    expect(callback).toHaveBeenCalledTimes(5);
    expect(callback).toHaveBeenLastCalledWith("completed");
  });

  it("transitions to failed if error occurs during any step", () => {
    inscriptionFSM.start();
    inscriptionFSM.messagePrepared();
    inscriptionFSM.error();

    expect(inscriptionFSM.getState()).toBe("failed");
    expect(callback).toHaveBeenLastCalledWith("failed");
  });

  it("transitions to rejected and can restart", () => {
    inscriptionFSM.start();
    inscriptionFSM.messagePrepared();
    inscriptionFSM.rejected();
    expect(inscriptionFSM.getState()).toBe("rejected");

    inscriptionFSM.start();
    expect(inscriptionFSM.getState()).toBe("preparing_message");
  });

  it("transitions to completed and can restart", () => {
    inscriptionFSM.start();
    inscriptionFSM.messagePrepared();
    inscriptionFSM.signed();
    inscriptionFSM.sent();
    inscriptionFSM.confirmed();
    expect(inscriptionFSM.getState()).toBe("completed");

    inscriptionFSM.start();
    expect(inscriptionFSM.getState()).toBe("preparing_message");
  });

  it("does not transition on invalid events", () => {
    expect(inscriptionFSM.getState()).toBe("idle");

    // Trying to send a CONFIRMED event in idle state
    inscriptionFSM.confirmed();

    expect(inscriptionFSM.getState()).toBe("idle");
    expect(callback).not.toHaveBeenCalled();
  });

  it("unsubscribe removes listener", () => {
    unsub();
    inscriptionFSM.start();
    expect(callback).not.toHaveBeenCalled();
  });
});
