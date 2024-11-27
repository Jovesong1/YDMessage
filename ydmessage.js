class YDMessage {
    static containers = {};
    static defaultOptions = {
        position: 'top-right',
        duration: 4000,
        showClose: true,
        autoClose: true,
        onClose: null,
        onClick: null
    };

    static getContainer(position) {
        if (!this.containers[position]) {
            const container = document.createElement('div');
            container.className = `Jovesongmessage-container ${position}`;
            document.body.appendChild(container);
            this.containers[position] = container;
        }
        return this.containers[position];
    }

    static create(options) {
        const finalOptions = { ...this.defaultOptions, ...options };
        const container = this.getContainer(finalOptions.position);
        
        const messageEl = document.createElement('div');
        messageEl.className = `Jovesongmessage-item ${finalOptions.type || ''}`;
        
        const content = `
            <div class="Jovesongmessage-content">
                ${finalOptions.icon ? `
                    <div class="Jovesongmessage-icon ${finalOptions.type}">
                        <i class="fas ${this.getIcon(finalOptions.type)}"></i>
                    </div>
                ` : ''}
                <div class="Jovesongmessage-text">
                    ${finalOptions.title ? `
                        <h4 class="Jovesongmessage-title">${finalOptions.title}</h4>
                    ` : ''}
                    ${finalOptions.message ? `
                        <p class="Jovesongmessage-desc">${finalOptions.message}</p>
                    ` : ''}
                </div>
                ${finalOptions.showClose ? `
                    <button class="Jovesongmessage-close">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
            ${finalOptions.showActions ? `
                <div class="Jovesongmessage-actions">
                    <button class="Jovesongmessage-btn secondary" data-action="cancel">取消</button>
                    <button class="Jovesongmessage-btn primary" data-action="confirm">确认</button>
                </div>
            ` : ''}
            ${finalOptions.autoClose ? `
                <div class="Jovesongmessage-progress" style="width: 100%"></div>
            ` : ''}
        `;
        
        messageEl.innerHTML = content;

        if (finalOptions.onClick) {
            messageEl.addEventListener('click', finalOptions.onClick);
        }

        const closeBtn = messageEl.querySelector('.Jovesongmessage-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close(messageEl, finalOptions);
            });
        }

        if (finalOptions.showActions) {
            const btns = messageEl.querySelectorAll('.Jovesongmessage-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = e.target.dataset.action;
                    if (finalOptions[action]) {
                        finalOptions[action]();
                    }
                    this.close(messageEl, finalOptions);
                });
            });
        }

        container.appendChild(messageEl);
        requestAnimationFrame(() => messageEl.classList.add('show'));

        if (finalOptions.autoClose && finalOptions.duration > 0) {
            const progress = messageEl.querySelector('.Jovesongmessage-progress');
            if (progress) {
                setTimeout(() => {
                    progress.style.width = '0';
                }, 50);
            }
            setTimeout(() => {
                this.close(messageEl, finalOptions);
            }, finalOptions.duration);
        }

        return messageEl;
    }

    static getIcon(type) {
        const icons = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };
        return icons[type] || 'fa-bell';
    }

    static close(messageEl, options = {}) {
        messageEl.classList.remove('show');
        setTimeout(() => {
            messageEl.remove();
            if (options.onClose) {
                options.onClose();
            }
        }, 300);
    }

    static success(title, message = '', options = {}) {
        return this.create({
            type: 'success',
            icon: true,
            title,
            message,
            ...options
        });
    }

    static error(title, message = '', options = {}) {
        return this.create({
            type: 'error',
            icon: true,
            title,
            message,
            ...options
        });
    }

    static warning(title, message = '', options = {}) {
        return this.create({
            type: 'warning',
            icon: true,
            title,
            message,
            ...options
        });
    }

    static info(title, message = '', options = {}) {
        return this.create({
            type: 'info',
            icon: true,
            title,
            message,
            ...options
        });
    }

    static confirm(title, message = '', options = {}) {
        return this.create({
            type: 'info',
            icon: true,
            title,
            message,
            showActions: true,
            autoClose: false,
            ...options
        });
    }
}