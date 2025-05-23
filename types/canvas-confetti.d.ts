declare module "canvas-confetti" {
  type Options = {
    particleCount?: number
    angle?: number
    spread?: number
    startVelocity?: number
    decay?: number
    gravity?: number
    drift?: number
    ticks?: number
    origin?: {
      x?: number
      y?: number
    }
    colors?: string[]
    shapes?: string[]
    scalar?: number
    zIndex?: number
    disableForReducedMotion?: boolean
  }

  function confetti(options?: Options): Promise<null>
  function create(
    canvas: HTMLCanvasElement,
    options?: { resize?: boolean; useWorker?: boolean },
  ): (options?: Options) => Promise<null>

  export = confetti
}
