import { setup, assign } from 'xstate'

export interface OnboardingContext {
  practiceId: string | null
  epicConnected: boolean
  mfaEnabled: boolean
  firstClaimCreated: boolean
  currentStep: number
  totalSteps: number
}

export type OnboardingEvent =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SKIP' }
  | { type: 'CONNECT_EPIC'; practiceId: string }
  | { type: 'EPIC_CONNECTED' }
  | { type: 'EPIC_ERROR'; error: string }
  | { type: 'SETUP_MFA' }
  | { type: 'MFA_ENABLED' }
  | { type: 'CREATE_FIRST_CLAIM' }
  | { type: 'CLAIM_CREATED' }
  | { type: 'COMPLETE' }

const initialContext: OnboardingContext = {
  practiceId: null,
  epicConnected: false,
  mfaEnabled: false,
  firstClaimCreated: false,
  currentStep: 1,
  totalSteps: 5,
}

export const onboardingMachine = setup({
  types: {
    context: {} as OnboardingContext,
    events: {} as OnboardingEvent,
  },
  actions: {
    incrementStep: assign(({ context }) => ({
      currentStep: Math.min(context.currentStep + 1, context.totalSteps),
    })),
    decrementStep: assign(({ context }) => ({
      currentStep: Math.max(context.currentStep - 1, 1),
    })),
    setEpicConnected: assign({ epicConnected: true }),
    setMfaEnabled: assign({ mfaEnabled: true }),
    setFirstClaimCreated: assign({ firstClaimCreated: true }),
  },
  guards: {
    isEpicConnected: ({ context }) => context.epicConnected,
    isMfaEnabled: ({ context }) => context.mfaEnabled,
  },
}).createMachine({
  id: 'onboarding',
  initial: 'welcome',
  context: initialContext,
  states: {
    welcome: {
      entry: assign({ currentStep: 1 }),
      on: {
        NEXT: {
          target: 'practiceProfile',
          actions: 'incrementStep',
        },
      },
    },
    practiceProfile: {
      entry: assign({ currentStep: 2 }),
      on: {
        NEXT: {
          target: 'epicConnect',
          actions: 'incrementStep',
        },
        BACK: {
          target: 'welcome',
          actions: 'decrementStep',
        },
      },
    },
    epicConnect: {
      entry: assign({ currentStep: 3 }),
      initial: 'idle',
      states: {
        idle: {
          on: {
            CONNECT_EPIC: 'connecting',
            SKIP: '#onboarding.mfaSetup',
          },
        },
        connecting: {
          on: {
            EPIC_CONNECTED: {
              target: 'connected',
              actions: 'setEpicConnected',
            },
            EPIC_ERROR: 'error',
          },
        },
        connected: {
          on: {
            NEXT: '#onboarding.mfaSetup',
          },
        },
        error: {
          on: {
            CONNECT_EPIC: 'connecting',
            SKIP: '#onboarding.mfaSetup',
          },
        },
      },
      on: {
        BACK: {
          target: 'practiceProfile',
          actions: 'decrementStep',
        },
      },
    },
    mfaSetup: {
      entry: assign({ currentStep: 4 }),
      initial: 'idle',
      states: {
        idle: {
          on: {
            SETUP_MFA: 'setting',
          },
        },
        setting: {
          on: {
            MFA_ENABLED: {
              target: 'enabled',
              actions: 'setMfaEnabled',
            },
          },
        },
        enabled: {
          on: {
            NEXT: '#onboarding.firstClaim',
          },
        },
      },
      on: {
        BACK: {
          target: 'epicConnect',
          actions: 'decrementStep',
        },
      },
    },
    firstClaim: {
      entry: assign({ currentStep: 5 }),
      initial: 'idle',
      states: {
        idle: {
          on: {
            CREATE_FIRST_CLAIM: 'creating',
            SKIP: '#onboarding.complete',
          },
        },
        creating: {
          on: {
            CLAIM_CREATED: {
              target: 'created',
              actions: 'setFirstClaimCreated',
            },
          },
        },
        created: {
          on: {
            COMPLETE: '#onboarding.complete',
          },
        },
      },
      on: {
        BACK: {
          target: 'mfaSetup',
          actions: 'decrementStep',
        },
      },
    },
    complete: {
      type: 'final',
    },
  },
})
