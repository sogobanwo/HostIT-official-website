'use client';

import { lisk } from "viem/chains";
import { createConfig, http } from "wagmi";


export const config = createConfig({
    chains: [lisk],
    multiInjectedProviderDiscovery: false,
    transports: {
      [lisk.id]: http(),
    },
  });

 