// Elementos DOM
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.querySelector('.close');
const modalBtn = document.querySelector('.modal-btn');

// Navegação móvel
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Validação de data e horário
function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    
    // Data mínima: amanhã
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Data máxima: 14 dias a partir de hoje
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 14);
    
    const minFormattedDate = tomorrow.toISOString().split('T')[0];
    const maxFormattedDate = maxDate.toISOString().split('T')[0];
    
    dateInput.min = minFormattedDate;
    dateInput.max = maxFormattedDate;
    
    // Adicionar placeholder informativo
    dateInput.placeholder = `Selecione uma data entre ${minFormattedDate} e ${maxFormattedDate}`;
}

// Sistema de banco de dados simulado (localStorage)
const BOOKING_DB_KEY = 'barbearia_bookings';

// Função para obter todos os agendamentos
function getAllBookings() {
    const bookings = localStorage.getItem(BOOKING_DB_KEY);
    return bookings ? JSON.parse(bookings) : [];
}

// Função para salvar agendamento
function saveBooking(booking) {
    const bookings = getAllBookings();
    booking.id = Date.now(); // ID único
    booking.createdAt = new Date().toISOString();
    bookings.push(booking);
    localStorage.setItem(BOOKING_DB_KEY, JSON.stringify(bookings));
    return booking;
}

// Função para obter agendamentos por data
function getBookingsByDate(date) {
    const bookings = getAllBookings();
    return bookings.filter(booking => booking.date === date);
}

// Função para contar agendamentos por horário
function getBookingCountByTime(date, time) {
    const bookings = getBookingsByDate(date);
    return bookings.filter(booking => booking.time === time).length;
}

// Validação de horário de funcionamento
function updateTimeSlots() {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    if (!dateInput.value) return;
    
    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 14);
    
    // Verificar se a data está dentro do limite permitido
    if (selectedDate < tomorrow || selectedDate > maxDate) {
        timeSelect.innerHTML = '<option value="">Data fora do limite permitido (1-14 dias)</option>';
        return;
    }
    
    const dayOfWeek = selectedDate.getDay(); // 0 = Domingo, 6 = Sábado
    console.log('Dia da semana:', selectedDate);

    // Limpar opções existentes
    timeSelect.innerHTML = '<option value="">Selecione um horário</option>';
    
    // Definir horários baseado no dia da semana
    let timeSlots = [];
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Segunda a Sexta
        timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    } else if (dayOfWeek === 6) { // Sábado
        timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    } else { // Domingo
        timeSelect.innerHTML = '<option value="">Fechado aos domingos</option>';
        return;
    }
    
    // Adicionar opções de horário com verificação de disponibilidade
    timeSlots.forEach(time => {
        const bookingCount = getBookingCountByTime(dateInput.value, time);
        const option = document.createElement('option');
        option.value = time;
        
        if (bookingCount >= 2) {
            option.textContent = `${time} - Lotado (${bookingCount}/2)`;
            option.disabled = true;
            option.style.color = '#999';
        } else if (bookingCount === 1) {
            option.textContent = `${time} - 1 vaga disponível (${bookingCount}/2)`;
            option.style.color = '#ff6b35';
        } else {
            option.textContent = `${time} - Disponível`;
            option.style.color = '#28a745';
        }
        
        timeSelect.appendChild(option);
    });
}

// Máscara de telefone
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Aplicar formatação
    let formattedValue = '';
    
    if (value.length === 0) {
        formattedValue = '';
    } else if (value.length <= 2) {
        formattedValue = `(${value}`;
    } else if (value.length <= 7) {
        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else {
        formattedValue = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    }
    
    // Atualizar o valor
    input.value = formattedValue;
}

const inputTelefone = document.getElementById('phone');
if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
        formatPhoneNumber(e.target);
    });
}

// Aplicar máscara de telefone
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));

// Configurar data mínima ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    setMinDate();
    
    // Adicionar listener para mudança de data
    const dateInput = document.getElementById('date');
    dateInput.addEventListener('change', updateTimeSlots);
});

// Envio do formulário de agendamento
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookingForm);
    const selectedDate = new Date(formData.get('date') + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 14);
    
    // Validar se a data está dentro do limite
    if (selectedDate < tomorrow || selectedDate > maxDate) {
        alert('Por favor, selecione uma data entre amanhã e 14 dias a partir de hoje.');
        return;
    }
    
    // Validar se não é uma data anterior
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (selectedDate < todayStart) {
        alert('Não é possível agendar para datas anteriores.');
        return;
    }
    
    const selectedTime = formData.get('time');
    const selectedDateStr = formData.get('date');
    
    // Verificar disponibilidade do horário
    const bookingCount = getBookingCountByTime(selectedDateStr, selectedTime);
    if (bookingCount >= 2) {
        alert('Este horário já está lotado. Por favor, escolha outro horário.');
        return;
    }
    
    const message = formData.get('message').trim();
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: selectedDateStr,
        time: selectedTime,
        ...(message && { message })
    };
    
    try {
        // Salvar no banco de dados
        const savedBooking = saveBooking(bookingData);
        
        // Simular envio para servidor
        await submitBooking(savedBooking);
        
        // Mostrar modal de sucesso
        showSuccessModal();
        
        // Limpar formulário
        bookingForm.reset();
        
        // Atualizar horários disponíveis
        updateTimeSlots();
        
    } catch (error) {
        console.error('Erro ao agendar:', error);
        alert('Erro ao processar agendamento. Tente novamente.');
    }
});

// Função para enviar agendamento
async function submitBooking(data) {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Aqui você pode integrar com sua API ou serviço de e-mail
    console.log('Dados do agendamento:', data);
    
    // Exemplo de integração com Google Calendar (requer configuração adicional)
    // await addToGoogleCalendar(data);
    
    // Exemplo de envio por e-mail (requer backend)
    // await sendEmailNotification(data);

    return { success: true };
}

// Função para visualizar todos os agendamentos (útil para testes)
function viewAllBookings() {
    const bookings = getAllBookings();
    console.log('Todos os agendamentos:', bookings);
    
    if (bookings.length === 0) {
        console.log('Nenhum agendamento encontrado.');
        return;
    }
    
    bookings.forEach(booking => {
        console.log(`ID: ${booking.id} | ${booking.name} | ${booking.date} ${booking.time} | ${booking.service}`);
    });
}

// Função para limpar todos os agendamentos (útil para testes)
function clearAllBookings() {
    if (confirm('Tem certeza que deseja limpar todos os agendamentos?')) {
        localStorage.removeItem(BOOKING_DB_KEY);
        console.log('Todos os agendamentos foram removidos.');
        updateTimeSlots();
    }
}

// Adicionar funções ao window para acesso via console
window.viewAllBookings = viewAllBookings;
window.clearAllBookings = clearAllBookings;

// Mostrar modal de sucesso
function showSuccessModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners para fechar modal
closeModalBtn.addEventListener('click', closeModal);
modalBtn.addEventListener('click', closeModal);

// Fechar modal ao clicar fora dele
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Scroll suave para links de navegação
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animação de scroll para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .about-content, .gallery-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Integração com Google Calendar (exemplo)
async function addToGoogleCalendar(bookingData) {
    // Esta função requer configuração da API do Google Calendar
    // Você precisará de um backend para gerar o token de acesso
    
    const event = {
        summary: `Agendamento - ${bookingData.name}`,
        description: `Serviço: ${bookingData.service}\nTelefone: ${bookingData.phone}\nObservações: ${bookingData.message || 'Nenhuma'}`,
        start: {
            dateTime: `${bookingData.date}T${bookingData.time}:00-03:00`,
            timeZone: 'America/Sao_Paulo'
        },
        end: {
            dateTime: `${bookingData.date}T${getEndTime(bookingData.time, bookingData.service)}:00-03:00`,
            timeZone: 'America/Sao_Paulo'
        }
    };
    
    console.log('Evento para Google Calendar:', event);
    
    // Implementar chamada para API do Google Calendar
    // const response = await fetch('/api/google-calendar', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(event)
    // });
    
    // return response.json();
}

// Função auxiliar para calcular horário de fim
function getEndTime(startTime, service) {
    const serviceDurations = {
        'corte': 45,
        'barba': 30,
        'sobrancelha': 20,
        'combo': 60,
        'hidratacao': 40,
        'blackmask': 35
    };
    
    const duration = serviceDurations[service] || 45;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = minutes + duration;
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
}

// Envio de e-mail (exemplo)
async function sendEmailNotification(bookingData) {
    const emailData = {
        to: 'barbeariaelite86@gmail.com',
        subject: 'Novo Agendamento - Barbearia Elite',
        body: `
            Novo agendamento realizado:
            
            Nome: ${bookingData.name}
            Telefone: ${bookingData.phone}
            Serviço: ${bookingData.service}
            Data: ${bookingData.date}
            Horário: ${bookingData.time}
            Observações: ${bookingData.message || 'Nenhuma'}
        `
    };
    
    console.log('E-mail para enviar:', emailData);
    
    // Implementar chamada para serviço de e-mail
    // const response = await fetch('/api/send-email', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(emailData)
    // });
    
    // return response.json();
}

// Validação em tempo real
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    const submitBtn = document.querySelector('.submit-btn');
    
    if (name && phone && service && date && time) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
    }
}

// Adicionar listeners para validação em tempo real
document.getElementById('name').addEventListener('input', validateForm);
document.getElementById('phone').addEventListener('input', validateForm);
document.getElementById('service').addEventListener('change', validateForm);
document.getElementById('date').addEventListener('change', validateForm);
document.getElementById('time').addEventListener('change', validateForm);

// Inicializar validação
document.addEventListener('DOMContentLoaded', validateForm);

// Prevenção de envio duplo
let isSubmitting = false;

bookingForm.addEventListener('submit', (e) => {
    if (isSubmitting) {
        e.preventDefault();
        return;
    }
    
    isSubmitting = true;
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.textContent = 'Processando...';
    submitBtn.disabled = true;
    
    // Resetar após 5 segundos
    setTimeout(() => {
        isSubmitting = false;
        submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirmar Agendamento';
        submitBtn.disabled = false;
    }, 5000);
});

// Melhorar acessibilidade
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.style.display === 'block') {
        closeModal();
    }
});

// Adicionar atributos ARIA para acessibilidade
document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', button.textContent.trim());
    }
});

// Performance: Lazy loading para imagens
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Efeito de parallax no hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Contador animado para estatísticas
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Animar contadores quando visíveis
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
});

document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// Smooth reveal para galeria
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'scale(1)';
        }
    });
});

document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.8)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    galleryObserver.observe(item);
});

// Validação de telefone mais robusta
function validatePhone(phone) {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    return phoneRegex.test(phone);
}

// Adicionar validação de telefone ao formulário
phoneInput.addEventListener('blur', () => {
    const phone = phoneInput.value;
    if (phone && !validatePhone(phone)) {
        phoneInput.style.borderColor = '#dc3545';
        phoneInput.setCustomValidity('Por favor, insira um telefone válido');
    } else {
        phoneInput.style.borderColor = '';
        phoneInput.setCustomValidity('');
    }
});

// Limitar caracteres no campo de observações
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.addEventListener('input', () => {
        const maxLength = 200;
        const currentLength = messageTextarea.value.length;
        
        if (currentLength > maxLength) {
            messageTextarea.value = messageTextarea.value.substring(0, maxLength);
        }
        
        // Opcional: mostrar contador de caracteres
        const counter = document.createElement('div');
        counter.textContent = `${currentLength}/${maxLength}`;
        counter.style.fontSize = '0.8rem';
        counter.style.color = '#666';
        counter.style.textAlign = 'right';
        counter.style.marginTop = '0.5rem';
        
        const existingCounter = messageTextarea.parentNode.querySelector('.char-counter');
        if (existingCounter) {
            existingCounter.remove();
        }
        
        counter.classList.add('char-counter');
        messageTextarea.parentNode.appendChild(counter);
    });
}

// Efeito de hover nos cards de serviço
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Loading state para botões
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    } else {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-calendar-check"></i> Confirmar Agendamento';
    }
}

// Melhorar UX do formulário
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentNode.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
        if (!field.value) {
            field.parentNode.classList.remove('focused');
        }
    });
});

// Adicionar classe CSS para campos com valor
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    if (field.value) {
        field.parentNode.classList.add('has-value');
    }
    
    field.addEventListener('input', () => {
        if (field.value) {
            field.parentNode.classList.add('has-value');
        } else {
            field.parentNode.classList.remove('has-value');
        }
    });
});
