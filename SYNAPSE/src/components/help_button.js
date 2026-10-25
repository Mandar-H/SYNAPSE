// help-button.js
// Extracted help button and animation features from main.js

(function() {
  // Particle effect for help button
  function createParticles() {
    const particleContainer = document.getElementById('particleContainer');
    if (!particleContainer) return;
    
    // Clear existing particles
    particleContainer.innerHTML = '';
    
    // Create new particles
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position and animation
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const scale = 0.5 + Math.random() * 1.5;
      const duration = 2 + Math.random() * 2;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--scale', scale);
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      particleContainer.appendChild(particle);
    }
  }
  
  // Initialize help button functionality
  function initHelpButton() {
    const helpToggle = document.getElementById('help-toggle');
    
    if (!helpToggle) return;
    
    // Add hover effect to make button more dynamic
    helpToggle.addEventListener('mouseenter', () => {
      createParticles();
    });
    
    // Open chatbot page when help button is clicked with smooth transition
    helpToggle.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Create more particles for a dramatic effect
      createParticles();
      createParticles();
      
      // Add a pulse animation class
      helpToggle.classList.add('pulse-animation');
      
      // Create a smooth page transition effect
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 300ms ease';
      
      // Navigate to the chatbot page after transition completes
      setTimeout(() => {
        window.location.href = 'chatbot.html';
      }, 300);
    });
  }

  // Expose initHelpButton globally
  window.initHelpButton = initHelpButton;
})();
