document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
    
    // Expandable sections
    const expandableSections = document.querySelectorAll('.expandable-section');
    expandableSections.forEach(section => {
      const header = section.querySelector('.expandable-header');
      header.addEventListener('click', () => {
        section.classList.toggle('active');
      });
    });
    
    // Scroll animations
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.section-nav a');
    
    // Initial visibility check
    checkVisibility();
    
    // Listen for scroll events
    window.addEventListener('scroll', () => {
      checkVisibility();
      updateActiveNavLink();
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
          top: targetSection.offsetTop - 80, // Offset for header
          behavior: 'smooth'
        });
      });
    });
    
    // Check if sections are visible and animate them
    function checkVisibility() {
      const triggerPoint = window.innerHeight * 0.8;
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < triggerPoint) {
          section.classList.add('visible');
        }
      });
    }
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
          currentSection = '#' + section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
          link.classList.add('active');
        }
      });
    }
    
    // Growth chart
    createGrowthChart();
    
    function createGrowthChart() {
      const canvas = document.getElementById('growthChart');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.parentElement.clientWidth;
      const height = 300;
      canvas.width = width;
      canvas.height = height;
      
      // Data points for MRR
      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const mrr = [0, 0, 3, 3, 15, 50, 150, 400, 830];
      
      // Chart dimensions
      const padding = 40;
      const chartWidth = width - (padding * 2);
      const chartHeight = height - (padding * 2);
      
      // Clear the canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw the axes
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.stroke();
      
      // Draw the x-axis labels
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
      ctx.font = '12px var(--font-sans)';
      ctx.textAlign = 'center';
      
      for (let i = 0; i < months.length; i++) {
        const x = padding + (i * (chartWidth / (months.length - 1)));
        ctx.fillText(`M${months[i]}`, x, height - padding + 20);
      }
      
      // Draw the y-axis labels
      const maxMRR = Math.max(...mrr);
      ctx.textAlign = 'right';
      
      for (let i = 0; i <= 4; i++) {
        const y = height - padding - (i * (chartHeight / 4));
        const value = Math.round((i / 4) * maxMRR);
        ctx.fillText(`$${value}K`, padding - 10, y + 5);
      }
      
      // Draw the bars
      const barWidth = (chartWidth / months.length) * 0.6;
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      
      for (let i = 0; i < mrr.length; i++) {
        const x = padding + (i * (chartWidth / (months.length - 1))) - (barWidth / 2);
        const barHeight = (mrr[i] / maxMRR) * chartHeight;
        const y = height - padding - barHeight;
        
        ctx.fillStyle = primaryColor;
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Add value on top of bars
        if (mrr[i] > 0) {
          ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
          ctx.textAlign = 'center';
          ctx.fillText(`$${mrr[i]}K`, x + (barWidth / 2), y - 10);
        }
      }
      
      // Draw the line for the target ARR
      const lineY = height - padding - (chartHeight * (830 / maxMRR));
      ctx.beginPath();
      ctx.moveTo(padding, lineY);
      ctx.lineTo(width - padding, lineY);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary');
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Add label for the target line
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--secondary');
      ctx.textAlign = 'right';
      ctx.fillText('$10M ARR Target', width - padding - 10, lineY - 10);
    }
    
    // Update chart on window resize
    window.addEventListener('resize', function() {
      createGrowthChart();
    });
    
    // Update chart on theme change
    themeToggle.addEventListener('click', function() {
      setTimeout(createGrowthChart, 50); // Slight delay to allow CSS variables to update
    });
  });