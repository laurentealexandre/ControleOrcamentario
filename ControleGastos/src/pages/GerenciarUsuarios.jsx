// src/pages/GerenciarUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/usuarios.css';

const GerenciarUsuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      alert('Erro ao carregar a lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (modoEdicao) {
        // Editar usuário existente
        await api.put(`/usuarios/${usuarioEditandoId}`, {
          nome: novoUsuario.nome,
          email: novoUsuario.email
        });
        alert('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        await api.post('/usuarios', novoUsuario);
        alert('Usuário criado com sucesso!');
      }
      
      // Limpar formulário e recarregar usuários
      setNovoUsuario({ nome: '', email: '', senha: '' });
      setModoEdicao(false);
      setUsuarioEditandoId(null);
      await carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert(error.response?.data?.message || 'Erro ao salvar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (usuario) => {
    setNovoUsuario({
      nome: usuario.nome,
      email: usuario.email,
      senha: '' // Não incluímos a senha por segurança
    });
    setModoEdicao(true);
    setUsuarioEditandoId(usuario.id);
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/usuarios/${id}`);
      alert('Usuário removido com sucesso!');
      await carregarUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setNovoUsuario({ nome: '', email: '', senha: '' });
    setModoEdicao(false);
    setUsuarioEditandoId(null);
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-content">
        <div className="usuarios-header">
          <h1>Gerenciar Usuários</h1>
          <button onClick={() => navigate('/verbas')} className="voltar-button">
            Voltar
          </button>
        </div>

        <div className="usuarios-form-section">
          <h2>{modoEdicao ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
          <form onSubmit={handleSubmit} className="usuarios-form">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                name="nome"
                value={novoUsuario.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={novoUsuario.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {!modoEdicao && (
              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  name="senha"
                  value={novoUsuario.senha}
                  onChange={handleInputChange}
                  required={!modoEdicao}
                />
              </div>
            )}
            
            <div className="form-buttons">
              <button type="submit" className="salvar-button" disabled={loading}>
                {loading ? 'Salvando...' : modoEdicao ? 'Atualizar' : 'Cadastrar'}
              </button>
              
              {modoEdicao && (
                <button 
                  type="button" 
                  className="cancelar-button" 
                  onClick={handleCancelar}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="usuarios-list-section">
          <h2>Usuários Cadastrados</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : usuarios.length === 0 ? (
            <p>Nenhum usuário encontrado.</p>
          ) : (
            <table className="usuarios-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Data de Criação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{new Date(usuario.data_criacao).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleEditar(usuario)}
                        className="editar-button"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(usuario.id)}
                        className="excluir-button"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default GerenciarUsuarios;