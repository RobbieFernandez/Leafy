import React from 'react';

interface modalProps {
    title: string;
    isOpen: boolean;
    close: () => any;
    children: React.ReactNode
}


export const Modal = (props: modalProps) => <div className={"modal" + (props.isOpen? " is-active" : "")}>
    <div className="modal-background" onClick={() => props.close()}></div>
    <div className="modal-card">
        <header className="modal-card-head">
            <p className="modal-card-title">{props.title}</p>
            <button className="delete" aria-label="close" onClick={() => props.close()}></button>
        </header>
        <section className="modal-card-body">
            {props.children}
        </section>
    </div>
</div>
