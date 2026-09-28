/**
 * THE SYSTEM | Solo Leveling Gamified Fitness Tracker
 * Master Interactive Controller & Audio Synthesizer Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* =========================================================================
     1. WEB AUDIO SYNTHESIZER ENGINE (Pure Web Audio API - Zero External Files)
     ========================================================================= */
  class SystemAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSystemChime() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.5, now); // C6
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    }

    playStatDing() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.08); // D6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    }

    playAriseAura() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Sub bass drop
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(130, now);
      bass.frequency.exponentialRampToValueAtTime(38, now + 0.85);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.85);

      bassGain.gain.setValueAtTime(0.25, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      bass.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      bass.start(now);
      bass.stop(now + 1.1);

      // Shimmer chord (E4, B4, E5)
      [329.63, 493.88, 659.25, 987.77].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + 0.1 + i * 0.04);
        g.gain.setValueAtTime(0.01, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.15 + i * 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(g);
        g.connect(this.ctx.destination);

        osc.start(now + 0.1 + i * 0.04);
        osc.stop(now + 0.9);
      });
    }

    playRankFanfare() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((note, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + index * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    }

    playPenaltySiren() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.4);
      osc.frequency.setValueAtTime(440, now + 0.6);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    }
  }

  const audio = new SystemAudioEngine();

  // Sound Toggle Control
  const sfxToggleBtn = document.getElementById('sfxToggleBtn');
  const sfxLabel = document.getElementById('sfxLabel');
  const sfxIcon = document.getElementById('sfxIcon');

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      audio.isMuted = !audio.isMuted;
      if (audio.isMuted) {
        sfxToggleBtn.classList.add('muted');
        if (sfxLabel) sfxLabel.textContent = 'SFX: OFF';
        if (sfxIcon) {
          sfxIcon.setAttribute('data-lucide', 'volume-x');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      } else {
        sfxToggleBtn.classList.remove('muted');
        if (sfxLabel) sfxLabel.textContent = 'SFX: ON';
        if (sfxIcon) {
          sfxIcon.setAttribute('data-lucide', 'volume-2');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        audio.playSystemChime();
      }
    });
  }

  /* =========================================================================
     2. FLOATING HOLOGRAPHIC SYSTEM NOTIFICATION MODAL
     ========================================================================= */
  const questModal = document.getElementById('systemQuestModal');
  const btnAcceptQuest = document.getElementById('btnAcceptQuest');
  const btnRejectQuest = document.getElementById('btnRejectQuest');

  const closeQuestModal = () => {
    if (questModal) {
      questModal.classList.add('dismissed');
      markQuestDone('questTaskAwaken');
      audio.playSystemChime();
    }
  };

  if (btnAcceptQuest) {
    btnAcceptQuest.addEventListener('click', () => {
      closeQuestModal();
    });
  }

  if (btnRejectQuest) {
    btnRejectQuest.addEventListener('click', () => {
      btnRejectQuest.disabled = true;
      btnRejectQuest.textContent = '[REJECTION OVERRIDDEN BY THE SYSTEM]';
      btnRejectQuest.style.color = '#ef4444';
      audio.playPenaltySiren();
      setTimeout(() => {
        closeQuestModal();
      }, 1000);
    });
  }

  /* =========================================================================
     3. SYSTEM STATUS WINDOW (Paperdoll HUD) & STAT POINTS
     ========================================================================= */
  let availableStatPoints = 3;
  const ptsCountEl = document.getElementById('ptsCount');
  const statPlusBtns = document.querySelectorAll('.stat-btn-plus');

  const stats = {
    STR: { el: document.getElementById('valSTR'), bar: document.getElementById('barSTR'), val: 182, max: 250 },
    VIT: { el: document.getElementById('valVIT'), bar: document.getElementById('barVIT'), val: 145, max: 250 },
    AGI: { el: document.getElementById('valAGI'), bar: document.getElementById('barAGI'), val: 190, max: 250 },
    INT: { el: document.getElementById('valINT'), bar: document.getElementById('barINT'), val: 160, max: 250 },
    SENSE: { el: document.getElementById('valSENSE'), bar: document.getElementById('barSENSE'), val: 135, max: 250 },
  };

  statPlusBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (availableStatPoints <= 0) return;

      const statKey = btn.getAttribute('data-stat');
      if (stats[statKey]) {
        availableStatPoints--;
        stats[statKey].val += 5;
        stats[statKey].el.textContent = stats[statKey].val;

        const pct = Math.min(100, Math.round((stats[statKey].val / stats[statKey].max) * 100));
        stats[statKey].bar.style.width = pct + '%';

        audio.playStatDing();
        markQuestDone('questTaskStats');

        // Update Remaining Points
        if (ptsCountEl) {
          ptsCountEl.textContent = availableStatPoints;
        }

        // Recalculate Combat Power on Hunter Card
        updateCombatPowerFromStats();

        if (availableStatPoints === 0) {
          statPlusBtns.forEach(b => {
            b.disabled = true;
          });
          const badge = document.getElementById('statPointsRemaining');
          if (badge) {
            badge.textContent = 'NO UNALLOCATED POINTS';
            badge.style.borderColor = 'rgba(255,255,255,0.1)';
            badge.style.color = '#94a3b8';
          }
        }
      }
    });
  });

  const updateCombatPowerFromStats = () => {
    const totalStats = Object.values(stats).reduce((acc, s) => acc + s.val, 0);
    const cpVal = totalStats * 115 + 1200;
    const cardCpEl = document.getElementById('cardCombatPower');
    if (cardCpEl) {
      cardCpEl.textContent = cpVal.toLocaleString() + ' CP';
    }
  };

  /* Equipment Lore Tooltip Inspector */
  const gearSlots = document.querySelectorAll('.equip-slot');
  const gearTooltip = document.getElementById('gearTooltip');
  const tooltipTitle = document.getElementById('tooltipTitle');
  const tooltipDesc = document.getElementById('tooltipDesc');

  const gearLore = {
    'kasaka': {
      title: "KASAKA'S POISON FANG [DAGGER // GRADE: A]",
      desc: "Harvested from the Blue Venom-Fanged Kasaka in Hapjung Station. Inflicts 'Bleed' and 'Paralysis' debuffs on struck targets. Attack +25."
    },
    'demon-sword': {
      title: "DEMON KING'S LONGSWORD [BLADE // GRADE: S]",
      desc: "Forged in the Demon Castle. Imbued with the soul of Demon King Baran. Summons a storm of lightning upon hitting critical strikes. Attack +350."
    },
    'knight-plate': {
      title: "HIGH KNIGHT COMMANDER PLATE [ARMOR // GRADE: S]",
      desc: "Heavy plate enchanted by royal spellcasters. Reduces incoming physical damage by 20% and renders wearer immune to minor hexes."
    },
    'orb-avarice': {
      title: "ORB OF AVARICE [MAGICAL RELIC // GRADE: S]",
      desc: "Recovered from the High Orc Shaman Kargalgan. Doubles the destructive output of all fire and mana incantations."
    }
  };

  gearSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      const gearKey = slot.getAttribute('data-gear');
      const item = gearLore[gearKey];
      if (item && gearTooltip && tooltipTitle && tooltipDesc) {
        tooltipTitle.textContent = item.title;
        tooltipDesc.textContent = item.desc;
        gearTooltip.classList.add('show');
        audio.playStatDing();

        setTimeout(() => {
          gearTooltip.classList.remove('show');
        }, 6500);
      }
    });
  });

  /* =========================================================================
     4. HUNTER RANK CALCULATOR & ANIMATED HUNTER ID CARD
     ========================================================================= */
  const calcPushupsInput = document.getElementById('calcPushupsInput');
  const calcRunInput = document.getElementById('calcRunInput');
  const calcNameInput = document.getElementById('calcNameInput');
  const btnCalculateRank = document.getElementById('btnCalculateRank');

  const labelPushupsVal = document.getElementById('labelPushupsVal');
  const labelRunVal = document.getElementById('labelRunVal');

  const cardHunterName = document.getElementById('cardHunterName');
  const cardHunterClass = document.getElementById('cardHunterClass');
  const cardRankEmblem = document.getElementById('cardRankEmblem');
  const hudRankBadge = document.getElementById('hudRankBadge');
  const hudPlayerName = document.getElementById('hudPlayerName');

  const presetButtons = document.querySelectorAll('.preset-chip');

  const presets = {
    e: { pushups: 12, run: 34.0, name: "E-RANK RECRUIT" },
    c: { pushups: 45, run: 25.5, name: "C-RANK RAIDER" },
    a: { pushups: 80, run: 19.5, name: "A-RANK VANGUARD" },
    s: { pushups: 100, run: 17.5, name: "S-RANK MONARCH" },
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const p = presets[btn.getAttribute('data-preset')];
      if (p) {
        calcPushupsInput.value = p.pushups;
        calcRunInput.value = p.run;
        calcNameInput.value = p.name;
        runRankCalculation();
      }
    });
  });

  const runRankCalculation = () => {
    const pushups = parseInt(calcPushupsInput.value, 10) || 0;
    const runTime = parseFloat(calcRunInput.value) || 30;
    const name = calcNameInput.value.trim().toUpperCase() || "HUNTER";

    if (labelPushupsVal) labelPushupsVal.textContent = pushups + ' reps';
    if (labelRunVal) labelRunVal.textContent = runTime + ' mins';

    // Evaluation Logic
    let rank = 'E';
    let rankClass = 'rank-e';
    let jobClass = 'Civilian Vanguard';
    let badgeColor = '#94a3b8';

    if (pushups >= 95 && runTime <= 18.0) {
      rank = 'S';
      rankClass = 'rank-s';
      jobClass = 'SHADOW MONARCH';
      badgeColor = '#f59e0b';
    } else if (pushups >= 70 && runTime <= 22.0) {
      rank = 'A';
      rankClass = 'rank-a';
      jobClass = 'Strike Team Commander';
      badgeColor = '#a855f7';
    } else if (pushups >= 48 && runTime <= 25.0) {
      rank = 'B';
      rankClass = 'rank-b';
      jobClass = 'Dungeon Vanguard';
      badgeColor = '#38bdf8';
    } else if (pushups >= 28 && runTime <= 29.0) {
      rank = 'C';
      rankClass = 'rank-c';
      jobClass = 'Raid Specialist';
      badgeColor = '#34d399';
    } else if (pushups >= 15 && runTime <= 33.0) {
      rank = 'D';
      rankClass = 'rank-d';
      jobClass = 'Gate Explorer';
      badgeColor = '#fb923c';
    } else {
      rank = 'E';
      rankClass = 'rank-e';
      jobClass = 'E-Rank Novice';
      badgeColor = '#94a3b8';
    }

    // Update Card & HUD
    if (cardHunterName) cardHunterName.textContent = name;
    if (hudPlayerName) hudPlayerName.textContent = name;
    if (cardHunterClass) cardHunterClass.textContent = jobClass;

    if (cardRankEmblem) {
      cardRankEmblem.textContent = rank;
      cardRankEmblem.className = 'card-rank-emblem ' + rankClass;
    }

    if (hudRankBadge) {
      hudRankBadge.textContent = rank + '-RANK';
      hudRankBadge.style.background = badgeColor;
    }

    // Recalculate power score
    const cp = Math.round((pushups * 480) + Math.max(0, (40 - runTime) * 1150) + 2400);
    const cardCpEl = document.getElementById('cardCombatPower');
    if (cardCpEl) {
      cardCpEl.textContent = cp.toLocaleString() + ' CP';
    }

    audio.playRankFanfare();
    markQuestDone('questTaskRank');
  };

  if (btnCalculateRank) {
    btnCalculateRank.addEventListener('click', runRankCalculation);
  }

  if (calcPushupsInput) calcPushupsInput.addEventListener('input', runRankCalculation);
  if (calcRunInput) calcRunInput.addEventListener('input', runRankCalculation);
  if (calcNameInput) calcNameInput.addEventListener('input', runRankCalculation);

  // 3D Card Tilt Effect on Mouse Move
  const hunterCard = document.getElementById('hunterIdCard');
  if (hunterCard) {
    hunterCard.addEventListener('mousemove', (e) => {
      const rect = hunterCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      hunterCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    hunterCard.addEventListener('mouseleave', () => {
      hunterCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* =========================================================================
     5. BENTO GRID: REAL-TIME AI CAMERA SIMULATOR (FEATURE A)
     ========================================================================= */
  const btnTestRep = document.getElementById('btnTestRep');
  const repCounterEl = document.getElementById('repCounter');
  const damagePopText = document.getElementById('damagePopText');
  const monsterHpFill = document.getElementById('monsterHpFill');
  const monsterHpLabel = document.getElementById('monsterHpLabel');
  const skeletonSvg = document.getElementById('skeletonSvg');

  let currentReps = 18;
  let monsterHp = 650;
  const maxMonsterHp = 1000;

  if (btnTestRep) {
    btnTestRep.addEventListener('click', () => {
      currentReps++;
      if (repCounterEl) repCounterEl.textContent = currentReps;

      // Animate Skeleton SVG
      if (skeletonSvg) {
        skeletonSvg.style.transform = 'scaleY(0.78) translateY(12px)';
        setTimeout(() => {
          skeletonSvg.style.transform = 'scaleY(1) translateY(0)';
        }, 220);
      }

      // Monster HP Damage
      const dmg = Math.floor(Math.random() * 120) + 280;
      monsterHp = Math.max(0, monsterHp - dmg);

      const hpPercent = Math.round((monsterHp / maxMonsterHp) * 100);
      if (monsterHpFill) monsterHpFill.style.width = hpPercent + '%';
      if (monsterHpLabel) monsterHpLabel.textContent = `${monsterHp} / 1,000 HP`;

      // Damage Text Pop
      if (damagePopText) {
        damagePopText.textContent = `-${dmg} CRIT!`;
        damagePopText.classList.add('pop');
        setTimeout(() => {
          damagePopText.classList.remove('pop');
        }, 550);
      }

      audio.playStatDing();

      // Reset boss if defeated
      if (monsterHp <= 0) {
        setTimeout(() => {
          alert("[SYSTEM VICTORY]: BOSS CERBERUS ELIMINATED! REWARDS DISTRIBUTED: +500 MANA CRYSTALS");
          monsterHp = 1000;
          if (monsterHpFill) monsterHpFill.style.width = '100%';
          if (monsterHpLabel) monsterHpLabel.textContent = '1,000 / 1,000 HP';
        }, 300);
      }
    });
  }

  /* =========================================================================
     6. BENTO GRID: GPS GATES RADAR INTERACTION (FEATURE B)
     ========================================================================= */
  const radarMarkers = document.querySelectorAll('.radar-gate-marker');
  const radarGateInfo = document.getElementById('radarGateInfo');

  radarMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      const gateText = marker.getAttribute('data-gate');
      if (radarGateInfo && gateText) {
        radarGateInfo.textContent = 'GATE IDENTIFIED: ' + gateText;
        radarGateInfo.style.color = '#00f0ff';
        audio.playSystemChime();
        markQuestDone('questTaskRadar');
      }
    });
  });

  /* =========================================================================
     7. BENTO GRID: "ARISE" & SHADOW ARMY ROSTER (FEATURE C)
     ========================================================================= */
  const btnAriseCmd = document.getElementById('btnAriseCmd');
  const soldierCards = document.querySelectorAll('.soldier-card');
  const soldierDetailBox = document.getElementById('soldierDetailBox');

  const shadowArmyData = {
    igris: {
      name: "SHADOW COMMANDER IGRIS",
      desc: "Elite swordsman extracted from Job Change Quest. Passive Perk: Grants +15% Agility to daily sprint quests and auto-mines 1,200 Gold/hour."
    },
    beru: {
      name: "ANT KING BERU",
      desc: "Monarch of the Ant Colony extracted during Jeju Island Raid. Possesses flight and instantaneous regeneration. Buff: +25% Recovery speed from heavy workouts."
    },
    tank: {
      name: "ICE BEAR ALPHA TANK",
      desc: "Beast commander extracted from the Red Gate blizzard. Massive physical fortitude grants endurance shielding during 10KM daily endurance runs."
    },
    iron: {
      name: "SHADOW KNIGHT IRON",
      desc: "Heavy defensive sentinel. Emits a piercing taunt that lowers fatigue impact during grueling calisthenics drop-sets."
    },
    tusk: {
      name: "HIGH ORC SHAMAN TUSK",
      desc: "Grand Sorcerer extracted from the A-Rank Gate. Channeling the Orb of Avarice, multiplies passive daily Mana Crystal yield by 2.0x."
    }
  };

  soldierCards.forEach(card => {
    card.addEventListener('click', () => {
      soldierCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const soldierKey = card.getAttribute('data-soldier');
      const data = shadowArmyData[soldierKey];
      if (data && soldierDetailBox) {
        soldierDetailBox.innerHTML = `<strong>[${data.name}]</strong>: ${data.desc}`;
        audio.playStatDing();
      }
    });
  });

  if (btnAriseCmd) {
    btnAriseCmd.addEventListener('click', () => {
      audio.playAriseAura();
      markQuestDone('questTaskArise');

      // Visual flash
      document.body.style.filter = 'hue-rotate(240deg) saturate(1.8)';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 350);

      if (soldierDetailBox) {
        soldierDetailBox.innerHTML = `
          <strong style="color:#a855f7;">[EXTRACTION SUCCESSFUL: "ARISE!"]</strong> 
          The shadows obey your command. +1 Elite Shadow Soldier summoned into active roster. AFK mining active!
        `;
      }
    });
  }

  /* =========================================================================
     8. BENTO GRID: PENALTY ZONE COUNTDOWN & SIMULATION (FEATURE D)
     ========================================================================= */
  const penaltyTimerEl = document.getElementById('penaltyTimer');
  const btnTestPenalty = document.getElementById('btnTestPenalty');
  const penaltyModalOverlay = document.getElementById('penaltyModalOverlay');
  const btnClosePenalty = document.getElementById('btnClosePenalty');

  const updatePenaltyCountdown = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);

    const diff = Math.max(0, midnight - now);
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

    if (penaltyTimerEl) {
      penaltyTimerEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
  };

  setInterval(updatePenaltyCountdown, 1000);
  updatePenaltyCountdown();

  if (btnTestPenalty && penaltyModalOverlay) {
    btnTestPenalty.addEventListener('click', () => {
      penaltyModalOverlay.classList.add('active');
      audio.playPenaltySiren();
    });
  }

  if (btnClosePenalty && penaltyModalOverlay) {
    btnClosePenalty.addEventListener('click', () => {
      penaltyModalOverlay.classList.remove('active');
    });
  }

  /* =========================================================================
     9. FLOATING QUEST PROGRESS TRACKER & MINIMIZE CONTROL
     ========================================================================= */
  const completedTasks = new Set();
  const totalTasks = 5;
  const trackerCountEl = document.getElementById('trackerProgressCount');
  const questTracker = document.getElementById('floatingQuestTracker');
  const trackerHeader = document.getElementById('trackerHeader');
  const trackerToggleBtn = document.getElementById('trackerToggleBtn');

  // Restore minimized preference if stored
  if (questTracker && localStorage.getItem('system_quest_tracker_minimized') === 'true') {
    questTracker.classList.add('minimized');
  }

  const toggleTrackerMinimize = (e) => {
    if (questTracker) {
      const isMin = questTracker.classList.toggle('minimized');
      localStorage.setItem('system_quest_tracker_minimized', isMin ? 'true' : 'false');
      audio.playStatDing();
    }
  };

  if (trackerToggleBtn) {
    trackerToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTrackerMinimize();
    });
  }

  if (trackerHeader) {
    trackerHeader.addEventListener('click', toggleTrackerMinimize);
  }

  function markQuestDone(elementId) {
    const el = document.getElementById(elementId);
    if (el && !completedTasks.has(elementId)) {
      completedTasks.add(elementId);
      el.classList.add('done');
      const icon = el.querySelector('svg, i');
      if (icon) {
        icon.setAttribute('data-lucide', 'check-circle-2');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
      if (trackerCountEl) {
        trackerCountEl.textContent = `${completedTasks.size} / ${totalTasks} DONE`;
      }
    }
  }

  // Pre-complete the awakening step upon load
  markQuestDone('questTaskAwaken');

  /* =========================================================================
     10. CUSTOM CURSOR
     ========================================================================= */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    };
    renderRing();

    document.querySelectorAll('a, button, input, .equip-slot, .soldier-card, details').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  }

  /* =========================================================================
     11. NAVIGATION & SCROLL INTERACTIONS
     ========================================================================= */
  const header = document.getElementById('systemHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (mobileToggleBtn && mobileNavDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      const isActive = mobileNavDrawer.classList.toggle('active');
      mobileToggleBtn.classList.toggle('active');
      mobileToggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth hash link scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
